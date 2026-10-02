package subscription

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"

	"encore.app/backend/user"
	"encore.dev/beta/errs"
	"encore.dev/rlog"
	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/billingportal/configuration"
	portalsession "github.com/stripe/stripe-go/v81/billingportal/session"
	"github.com/stripe/stripe-go/v81/checkout/session"
	"github.com/stripe/stripe-go/v81/client"
	"github.com/stripe/stripe-go/v81/customer"
	"github.com/stripe/stripe-go/v81/webhook"
	"gorm.io/gorm"
)

type CreateCheckoutSessionResponse struct {
	URL string `json:"url"`
}

type CreateCheckoutSessionRequest struct {
	PriceID string `json:"price_id"`
}

type SessionResponse struct {
	SessionID string `json:"session_id"`
}

type FilterSubscriptionsRequest struct {
	UserId string `json:"user_id"`
}

type SubscriptionsResponse struct {
	Subscriptions []*SubscriptionResponse `json:"subscriptions"`
}

type SubscriptionResponse struct {
	ID                    string     `json:"id"`
	UserId                string     `json:"user_id"`
	StripeProductId       string     `json:"stripe_product_id"`
	SubscriptionStatus    string     `json:"subscription_status"`
	SubscriptionUpdatedAt time.Time  `json:"subscription_updated_at"`
	SubscriptionCreatedAt time.Time  `json:"subscription_created_at"`
	CancelAtPeriodEnd     bool       `json:"cancel_at_period_end"`
	CancelAt              *time.Time `json:"cancel_at"`
}

//encore:api auth method=POST path=/v1/checkout-session
func (s *Service) CreateCheckoutSession(ctx context.Context, req *CreateCheckoutSessionRequest) (*CreateCheckoutSessionResponse, error) {
	stripe.Key = secrets.StripeSecretKey
	loggedInUser, err := user.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var customerId *string
	if loggedInUser.StripeCustomerId != nil {
		customerId = loggedInUser.StripeCustomerId
	} else {
		// Create a new customer
		customer, err := customer.New(&stripe.CustomerParams{
			Email: stripe.String(loggedInUser.Email),
		})
		if err != nil {
			return nil, errs.WrapCode(err, errs.Internal, "failed to create stripe customer")
		}
		customerId = &customer.ID
	}

	// Update the user with the customer ID
	user.UpdateUser(ctx, loggedInUser.ID, &user.UpdateUserRequest{
		StripeCustomerId: *customerId,
	})
	params := &stripe.CheckoutSessionParams{
		Customer: customerId,
		Mode:     stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String(req.PriceID), // Your price ID from Stripe
				Quantity: stripe.Int64(1),
			},
		},
		SuccessURL: stripe.String(secrets.CallbackURL + "/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}"),
		CancelURL:  stripe.String(secrets.CallbackURL + "/dashboard?canceled=true"),
		// Attach the user ID as metadata
		ClientReferenceID:   stripe.String(loggedInUser.ID),
		AllowPromotionCodes: stripe.Bool(true),
		SubscriptionData: &stripe.CheckoutSessionSubscriptionDataParams{
			TrialPeriodDays: stripe.Int64(14),
		},
	}

	rlog.Info("Creating checkout session", "params", params)

	session, err := session.New(params)
	if err != nil {
		return nil, errs.WrapCode(err, errs.Internal, "failed to create checkout session")
	}

	return &CreateCheckoutSessionResponse{
		URL: session.URL,
	}, nil
}

type CreateCustomerPortalSessionResponse struct {
	URL string `json:"url"`
}

//encore:api auth method=POST path=/v1/customer-portal-session
func (s *Service) CreateCustomerPortalSession(ctx context.Context) (*CreateCustomerPortalSessionResponse, error) {
	eb := errs.B()
	stripe.Key = secrets.StripeSecretKey
	sc := &client.API{}
	sc.Init(secrets.StripeSecretKey, nil)
	loggedInUser, err := user.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	customerId := loggedInUser.StripeCustomerId
	if customerId == nil {
		return nil, eb.Code(errs.NotFound).Msg("user has no stripe customer id").Err()
	}

	// Fetch products
	iter := sc.Products.List(&stripe.ProductListParams{
		Active: stripe.Bool(true),
	})
	products := make([]*stripe.Product, 0)
	for iter.Next() {
		p := iter.Product()
		products = append(products, p)
	}

	// Check what product the user has
	subIter := sc.Subscriptions.List(&stripe.SubscriptionListParams{
		Customer: customerId,
	})
	subscriptions := make([]*stripe.Subscription, 0)
	for subIter.Next() {
		subscriptions = append(subscriptions, subIter.Subscription())
	}
	rlog.Info("subscriptions", "subscriptions", subscriptions)
	productIdUserHas := subscriptions[0].Items.Data[0].Price.Product.ID
	rlog.Info("productIdUserHas", "productIdUserHas", productIdUserHas)
	// fetch prices
	pricesIter := sc.Prices.List(&stripe.PriceListParams{
		Active: stripe.Bool(true),
	})
	prices := make([]*stripe.Price, 0)
	for pricesIter.Next() {
		p := pricesIter.Price()
		prices = append(prices, p)
	}
	rlog.Info("prices", "prices", prices)

	var productsUserDoesNotHave []*stripe.Product
	for _, p := range products {
		if p.ID != productIdUserHas {
			productsUserDoesNotHave = append(productsUserDoesNotHave, p)
		}
	}

	rlog.Info("productsUserDoesNotHave", "productsUserDoesNotHave", productsUserDoesNotHave)

	// Create stripe.BillingPortalConfigurationFeaturesSubscriptionUpdateProductParams from productsUserDoesNotHave
	productsUserDoesNotHaveParams := make([]*stripe.BillingPortalConfigurationFeaturesSubscriptionUpdateProductParams, 0)
	for _, p := range productsUserDoesNotHave {
		priceIds := make([]*string, 0)
		for _, price := range prices {
			if price.Product.ID == p.ID {
				priceIds = append(priceIds, &price.ID)
			}
		}
		if len(priceIds) > 0 {
			productsUserDoesNotHaveParams = append(productsUserDoesNotHaveParams, &stripe.BillingPortalConfigurationFeaturesSubscriptionUpdateProductParams{
				Product: stripe.String(p.ID),
				Prices:  priceIds,
			})
		}
	}

	rlog.Info("productsUserDoesNotHaveParams", "productsUserDoesNotHaveParams", productsUserDoesNotHaveParams)

	// create configuration
	configurationParams := &stripe.BillingPortalConfigurationParams{
		Features: &stripe.BillingPortalConfigurationFeaturesParams{
			InvoiceHistory: &stripe.BillingPortalConfigurationFeaturesInvoiceHistoryParams{
				Enabled: stripe.Bool(true),
			},
			SubscriptionCancel: &stripe.BillingPortalConfigurationFeaturesSubscriptionCancelParams{
				Enabled: stripe.Bool(true),
				Mode:    stripe.String("at_period_end"),
			},
			PaymentMethodUpdate: &stripe.BillingPortalConfigurationFeaturesPaymentMethodUpdateParams{
				Enabled: stripe.Bool(true),
			},
			SubscriptionUpdate: &stripe.BillingPortalConfigurationFeaturesSubscriptionUpdateParams{
				Enabled:  stripe.Bool(true),
				Products: productsUserDoesNotHaveParams,
				DefaultAllowedUpdates: []*string{
					stripe.String("price"),
					stripe.String("quantity"),
					stripe.String("promotion_code"),
				},
			},
		},
	}
	result, err := configuration.New(configurationParams)
	if err != nil {
		return nil, eb.Cause(err).Code(errs.Internal).Msg("failed to create billing portal configuration").Err()
	}

	rlog.Info("Billing portal configuration created", "configuration", result)

	params := &stripe.BillingPortalSessionParams{
		Customer:      stripe.String(*customerId),
		ReturnURL:     stripe.String(secrets.CallbackURL + "/dashboard"),
		Configuration: stripe.String(result.ID),
	}

	session, err := portalsession.New(params)
	if err != nil {
		return nil, eb.Cause(err).Code(errs.Internal).Msg("failed to create billing portal session").Err()
	}

	return &CreateCustomerPortalSessionResponse{
		URL: session.URL,
	}, nil
}

//encore:api auth method=GET path=/v1/session/:sessionID
func (s *Service) GetSession(ctx context.Context, sessionID string) (*SessionResponse, error) {
	stripe.Key = secrets.StripeSecretKey
	loggedInUser, err := user.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	params := &stripe.CheckoutSessionParams{
		Expand: []*string{stripe.String("customer")},
	}

	session, err := session.Get(sessionID, params)
	if err != nil {
		return nil, errs.WrapCode(err, errs.Internal, "failed to get checkout session")
	}

	rlog.Info("Updating user with customer ID", "customerID", session.Customer.ID)

	// Update the user with the session details
	user.UpdateUser(ctx, loggedInUser.ID, &user.UpdateUserRequest{
		StripeCustomerId: session.Customer.ID,
	})

	rlog.Info("User updated with customer ID", "customerID", session.Customer.ID)

	return &SessionResponse{
		SessionID: session.ID,
	}, nil
}

//encore:api auth method=GET path=/v1/subscriptions
func (s *Service) GetSubscriptions(ctx context.Context, p *FilterSubscriptionsRequest) (*SubscriptionsResponse, error) {
	eb := errs.B()

	var subscriptions []Subscription
	err := s.db.Where("user_id = ?", p.UserId).Find(&subscriptions).Error
	if err != nil {
		return nil, eb.Cause(err).Code(errs.Internal).Msg("failed to get subscriptions").Err()
	}

	subscriptionsResponse := make([]*SubscriptionResponse, 0)
	for _, subscription := range subscriptions {
		var cancelAt *time.Time
		if subscription.CancelAt != nil {
			cancelAt = subscription.CancelAt
		}
		subscriptionsResponse = append(subscriptionsResponse, &SubscriptionResponse{
			ID:                    subscription.ID,
			UserId:                subscription.UserId,
			StripeProductId:       *subscription.StripeProductId,
			SubscriptionStatus:    *subscription.SubscriptionStatus,
			SubscriptionUpdatedAt: subscription.SubscriptionUpdatedAt,
			SubscriptionCreatedAt: subscription.CreatedAt,
			CancelAtPeriodEnd:     subscription.CancelAtPeriodEnd,
			CancelAt:              cancelAt,
		})
	}

	return &SubscriptionsResponse{
		Subscriptions: subscriptionsResponse,
	}, nil
}

func nilIfEmpty[T comparable](value T) *T {
	var zeroValue T
	if value == zeroValue {
		return nil
	}
	return &value
}

//encore:api public raw path=/v1/stripe/webhook
func (s *Service) StripeWebhook(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	stripe.Key = secrets.StripeSecretKey

	// Read the request body
	body, err := io.ReadAll(req.Body)
	if err != nil {
		rlog.Error("Failed to read webhook request body", "error", err)
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}
	rlog.Info("StripeWebhook secret", "secret", secrets.StripeWebhookSecret)
	// Verify the webhook signature
	sigHeader := req.Header.Get("Stripe-Signature")
	event, err := webhook.ConstructEvent(body, sigHeader, secrets.StripeWebhookSecret)
	if err != nil {
		rlog.Error("Error verifying webhook signature", "error", err, "header", sigHeader)
		http.Error(w, fmt.Sprintf("Error verifying webhook signature: %v", err), http.StatusBadRequest)
		return
	}

	rlog.Info("Received Stripe webhook event",
		"eventType", event.Type,
		"eventID", event.ID,
		"apiVersion", event.APIVersion)

	var handlerErr error
	switch event.Type {
	case "customer.subscription.deleted", "customer.subscription.updated", "customer.subscription.created":
		var subscription stripe.Subscription
		if err := json.Unmarshal(event.Data.Raw, &subscription); err != nil {
			rlog.Error("Error parsing subscription JSON", "error", err, "raw", string(event.Data.Raw))
			http.Error(w, "Error parsing webhook JSON", http.StatusBadRequest)
			return
		}

		handlerErr = s.handleSubscriptionEvent(ctx, subscription)

	default:
		rlog.Info("Unhandled event type", "type", event.Type)
		w.WriteHeader(http.StatusOK)
		return
	}

	if handlerErr != nil {
		var errCode errs.ErrCode
		if errors.As(handlerErr, &errCode) {
			rlog.Error("Error handling webhook event",
				"eventType", event.Type,
				"error", handlerErr,
				"code", errs.Code(handlerErr))
		} else {
			rlog.Error("Error handling webhook event",
				"eventType", event.Type,
				"error", handlerErr)
		}

		// Return a 500 error to trigger Stripe's retry mechanism
		http.Error(w, fmt.Sprintf("Error handling %s event: %v", event.Type, handlerErr), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"received": true}`))

}

func (s *Service) handleCheckoutSessionEvent(ctx context.Context, session stripe.CheckoutSession) error {
	eb := errs.B()
	userId := session.ClientReferenceID

	rlog.Info("Received event checkout session completed", "userId", userId)

	user.UpdateUser(ctx, userId, &user.UpdateUserRequest{
		StripeCustomerId: session.Customer.ID,
	})

	var stripeSubscription *Subscription
	err := s.db.Where("user_id = ?", userId).First(&stripeSubscription).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil
	} else if err != nil {
		return eb.Cause(err).Code(errs.Internal).Msg("failed to find stripe subscription").Err()
	}

	return nil
}

func (s *Service) handleSubscriptionEvent(ctx context.Context, subscription stripe.Subscription) error {
	eb := errs.B().Meta("subscription_id", subscription.ID).Meta("customer_id", subscription.Customer.ID)

	// Check if there is a user with the same stripe customer ID
	usersByFilter, err := user.GetUsersByFilter(ctx, &user.GetUsersByFilterRequest{
		StripeCustomerId: subscription.Customer.ID,
	})

	if err != nil || len(usersByFilter.Users) == 0 {
		return eb.Code(errs.NotFound).Msg("no user found for stripe customer id").Err()
	}

	// We expect only one user per stripe customer ID
	firstUser := usersByFilter.Users[0]

	rlog.Info("Subscription event related to user", "user", firstUser)

	status := string(subscription.Status)
	rlog.Info("Processing subscription event",
		"status", status,
		"subscription_id", subscription.ID,
		"customer_id", subscription.Customer.ID)

	var existingSubscription *Subscription
	err = s.db.Where("stripe_subscription_id = ?", subscription.ID).First(&existingSubscription).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			stripeSubscription := Subscription{
				UserId:                firstUser.ID,
				ID:                    subscription.ID,
				StripeCustomerId:      &subscription.Customer.ID,
				StripeSubscriptionId:  &subscription.ID,
				StripeProductId:       nilIfEmpty(subscription.Items.Data[0].Price.Product.ID),
				SubscriptionStatus:    &status,
				SubscriptionUpdatedAt: time.Now(),
				CancelAtPeriodEnd:     subscription.CancelAtPeriodEnd,
			}

			if err := s.db.Create(&stripeSubscription).Error; err != nil {
				return eb.Cause(err).Code(errs.Internal).Msg("failed to insert stripe subscription").Err()
			}
		} else {
			return eb.Cause(err).Code(errs.Internal).Msg("failed to find stripe subscription").Err()
		}
	} else {
		existingSubscription.StripeProductId = nilIfEmpty(subscription.Items.Data[0].Price.Product.ID)
		existingSubscription.StripeSubscriptionId = &subscription.ID
		existingSubscription.StripeCustomerId = &subscription.Customer.ID
		existingSubscription.SubscriptionStatus = &status
		existingSubscription.SubscriptionUpdatedAt = time.Now()
		existingSubscription.CancelAtPeriodEnd = subscription.CancelAtPeriodEnd
		cancelAt := time.Unix(subscription.CancelAt, 0)
		existingSubscription.CancelAt = &cancelAt
		if err := s.db.Save(existingSubscription).Error; err != nil {
			return eb.Cause(err).Code(errs.Internal).Msg("failed to update stripe subscription").Err()
		}
	}

	return nil
}
