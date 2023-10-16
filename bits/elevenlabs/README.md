# ElevenLabs Generative AI Text-to-Speech

This is an Encore package for generating text-to-speech audio using [ElevenLabs](https://elevenlabs.io/) generative voice AI.

## Installation

1. Copy over the `elevenlabs` package directory to your Encore application.
2. Sync your project dependencies by running `go mod tidy`.

## ElevenLabs API Key

You will need an [API key from ElevenLabs](https://docs.elevenlabs.io/api-reference/quick-start/authentication) to use this package. You can get one by signing up for a free account at https://elevenlabs.io/.

Once you have the API key, set it as an Encore secret using the name `ElevenLabsAPIKey`:

```bash
$ encore secret set --type dev,prod,local,pr ElevenLabsAPIKey
Enter secret value: *****
Successfully updated development secret ElevenLabsAPIKey.
```

## Endpoints 

The `elevenlabs` package contains the following endpoints:

### elevenlabs.ServeAudio

> ServeAudio generates audio from text and serves it as mpeg to the client.

#### Frontend example usage
```ts
// Making request to locally running backend...
const client = new Client(Local);
// or to a specific deployed environment
const client = new Client(Environment("staging"));

const resp = await client.elevenlabs.ServeAudio("POST", JSON.stringify({text}));
const url = window.URL.createObjectURL(await resp.blob()); //where value is the blob
const audio = new Audio();
audio.src = url;
await audio.play();
```

### elevenlabs.StreamAudio

> StreamAudio generates audio from text and streams it as mpeg to the client.

#### Frontend example usage
```html
<audio controls>
  <source src="http://localhost:4000/speech/stream" type="audio/mpeg"/>
  Your browser does not support the audio element.
</audio>
```

### elevenlabs.DownloadAudio

> DownloadAudio generates audio from text and saves the audio file as mp3 to disk.

## Learn More

- [Encore Documentation](https://encore.dev/docs)
- [ElevenLabs Documentation](https://docs.elevenlabs.io/welcome/introduction)
