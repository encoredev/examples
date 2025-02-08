import { LogtoConfig } from '@logto/react'

export const config: LogtoConfig = {
  endpoint: '<your-logto-endpoint>',
  appId: '<your-app-id>',
  resources: ['<your-api-resource-indicator>'],
}

export const appConfig = {
  apiResourceIndicator: '<your-api-resource-indicator>',
  signInRedirectUri: '<your-sign-in-redirect-uri>',
  signOutRedirectUri: '<your-sign-out-redirect-uri>',
}

export const encoreApiEndpoint = '<your-encore-api-endpoint>'
