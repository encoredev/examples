package product

import (
	"context"

	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/client"
)

var secrets struct {
	StripeSecretKey string
}

type ProductsResponse struct {
	Products []*Product `json:"products"`
}

type Product struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	PriceId     *string `json:"price_id"`
	Price       *Price  `json:"price"`
}

type Price struct {
	ID              string `json:"id"`
	UnitAmount      int64  `json:"unit_amount"`
	Currency        string `json:"currency"`
	Interval        string `json:"interval"`
	TrialPeriodDays int64  `json:"trial_period_days"`
}

//encore:api public method=GET path=/v1/products tag:cache
func GetProducts(ctx context.Context) (*ProductsResponse, error) {
	sc := &client.API{}
	sc.Init(secrets.StripeSecretKey, nil)

	iter := sc.Products.List(&stripe.ProductListParams{})
	products := make([]*Product, 0)

	iterp := sc.Prices.List(&stripe.PriceListParams{})
	prices := make(map[string]*stripe.Price)
	for iterp.Next() {
		p := iterp.Price()
		prices[p.Product.ID] = p
	}

	for iter.Next() {
		p := iter.Product()
		println(p.Name, p.Active)
		if !p.Active {
			continue
		}

		var productPrice *Price
		var priceId *string
		if price, ok := prices[p.ID]; ok {
			priceId = &p.ID
			recurring := price.Recurring
			interval := ""
			trialPeriodDays := int64(0)
			if recurring != nil {
				interval = string(recurring.Interval)
				trialPeriodDays = recurring.TrialPeriodDays
			}
			productPrice = &Price{
				ID:              price.ID,
				UnitAmount:      price.UnitAmount,
				Currency:        string(price.Currency),
				Interval:        interval,
				TrialPeriodDays: trialPeriodDays,
			}
		}

		products = append(products, &Product{
			ID:          p.ID,
			Name:        p.Name,
			Description: p.Description,
			PriceId:     priceId,
			Price:       productPrice,
		})
	}

	return &ProductsResponse{
		Products: products,
	}, nil
}
