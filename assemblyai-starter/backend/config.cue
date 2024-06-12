UseWebhook: bool | *true

if #Meta.Environment.Type == "development" && #Meta.Environment.Cloud == "local" {
    UseWebhook: false
}

if #Meta.Environment.Type == "test" {
    UseWebhook: false
}
