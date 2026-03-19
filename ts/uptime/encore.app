{
  "id": "",
  "lang": "typescript",
  "build": {
    "docker": {
      "bundle_source": true
    },
    "hooks": {
      "postbuild": "npx next build ./frontend"
    }
  }
}
