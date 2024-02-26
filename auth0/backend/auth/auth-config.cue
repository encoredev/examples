ClientID: "<your clientID>"
Domain: "<your domain>"

// An application running locally
if #Meta.Environment.Type == "development" && #Meta.Environment.Cloud == "local" {
		CallbackURL: "http://localhost:3000/callback"
		LogoutURL: "http://localhost:3000/"
}

