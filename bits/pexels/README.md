# Pexels Photo & Video Library

This is an Encore package for searching and retrieving photos and videos from [Pexels](https://www.pexels.com/).

## Installation

1. Copy over the `pexels` package directory to your Encore application.
2. Sync your project dependencies by running `go mod tidy`.

## Pexels API Key

You will need an [API key from Pexels](https://www.pexels.com/api/) to use this package. You can get one by signing up for a free account at https://www.pexels.com/.

Once you have the API key, set it as an Encore secret using the name `PexelsApiKey`:

```bash
$ encore secret set --type dev,prod,local,pr PexelsApiKey
Enter secret value: *****
Successfully updated development secret PexelsApiKey.
```

## Endpoints 

The `pexels` package contains the following endpoints:

* `pexels.SearchPhotos` - Search Pexels for photos. 
* `pexels.CuratedPhotos` - Receive real-time photos curated by the Pexels team.
* `pexels.GetPhoto` - Retrieve a specific photo.

* `pexels.SearchVideos` - Search Pexels for videos. 
* `pexels.PopularVideos` - Retrieve the current popular Pexels videos.
* `pexels.GetVideo` - Retrieve a specific video.

* `pexels.FeaturedCollections` - Retrieve all featured collections on Pexels. 
* `pexels.MyCollections` - Returns all of your collections.
* `pexels.CollectionMedia` - Returns all the media (photos and videos) within a single collection.


## Frontend example usage
After generating a [request client](https://encore.dev/docs/go/cli/client-generation) for your frontend you can call
the endpoints like this:

```ts
// Making request to locally running backend...
const client = new Client(Local);
// or to a specific deployed environment
const client = new Client(Environment("staging"));

const resp = await client.pexels.SearchPhotos({
  Query: "cats",
  Page: 1,
  PerPage: 15,
  Color: "",
  Locale: "",
  Size: "",
  Orientation: "",
});

console.log(resp.total_results);
console.log(resp.photos);
```

## Learn More

- [Encore Documentation](https://encore.dev/docs/go)
- [Pexels Documentation](https://www.pexels.com/api/documentation/)
