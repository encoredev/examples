ClientID: "<your clientID>"
Domain: "<your domain>"

// Where Auth0 sends users after login and logout. These default to the local
// frontend. To use a deployed frontend, set them per environment, for example:
//
// if #Meta.Environment.Type == "production" {
// 	CallbackURL: "https://app.example.com/callback"
// 	LogoutURL:   "https://app.example.com/"
// }
CallbackURL: string | *"http://localhost:3000/callback"
LogoutURL:   string | *"http://localhost:3000/"
