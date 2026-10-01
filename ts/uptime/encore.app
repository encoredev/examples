{
  "id": "",
  "lang": "typescript",
  "build": {
    "docker": {
      "bundle_source": true
    },
    "hooks": {
      "postbuild": "npm run build"
    }
  }
}
