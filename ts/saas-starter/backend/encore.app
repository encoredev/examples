{
	// This is just an example so it's not linked to the Encore platform.
  "id": "",
  
  "lang": "typescript",
  "global_cors": {
    // allow_origins_without_credentials specifies the allowed origins for requests
    // that don't include credentials. If nil it defaults to allowing all domains
    // (equivalent to ["*"]).
    "allow_origins_without_credentials": [
      "https://encorets-saas-starter.vercel.app"
    ],
    // allow_origins_with_credentials specifies the allowed origins for requests
    // that include credentials. If a request is made from an Origin in this list
    // Encore responds with Access-Control-Allow-Origin: <Origin>.
    //
    // The URLs in this list may include wildcards (e.g. "https://*.example.com"
    // or "https://*-myapp.example.com").
    "allow_origins_with_credentials": [
      "https://encorets-saas-starter.vercel.app"
    ]
  }
}
