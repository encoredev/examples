# {{name}}

Stores uploaded files. Each file's contents go to an object storage bucket
(`{{kebab}}-files`) and its metadata (content type, size, upload time) to a
Postgres table in the `{{ident}}` database. Uploading a file with the name of a
stored one replaces it.

Encore provisions the bucket and the database, and applies the migrations in
`./migrations`, when the app runs.

## Routes

| Method   | Path                    | What it does                                   |
| -------- | ----------------------- | ---------------------------------------------- |
| `GET`    | `/{{name}}/`            | An HTML page to upload files and list them     |
| `POST`   | `/{{name}}/upload`      | Upload one or more files (`multipart/form-data`) |
| `GET`    | `/{{name}}/files`       | List the stored files                          |
| `GET`    | `/{{name}}/files/:name` | Download a file                                |
| `DELETE` | `/{{name}}/files/:name` | Delete a file                                  |

With `encore run` running, call the service through the service proxy at
`localhost:4000/{{name}}`:

```sh
# Upload one file, or several in one request.
curl -F file=@photo.png localhost:4000/{{name}}/upload
curl -F a=@notes.txt -F b=@report.pdf localhost:4000/{{name}}/upload

# List them.
curl localhost:4000/{{name}}/files

# Download one; a name with spaces or slashes must be URL-encoded.
curl -o photo.png localhost:4000/{{name}}/files/photo.png

# Delete one.
curl -X DELETE localhost:4000/{{name}}/files/photo.png
```

Or open `http://localhost:4000/{{name}}/` in a browser to upload from a form.

`POST /{{name}}/upload` answers `201` with the stored files' metadata, or, for a
browser submitting the page's form, redirects back to the page. A download is
served with its stored content type; images display in the browser and other
files are downloaded, so an uploaded HTML or SVG file never runs as a page of
this site.

## Notes

- Uploads are read into memory whole, and Bun limits a request body to 128 MiB
  (`maxRequestBodySize` in `index.ts`). For large files, have clients upload
  straight to the bucket with `files.signedUploadUrl(name)` instead.
- The bucket is private: files are only reachable through this service. To serve
  them from a CDN instead, declare the bucket with `public: true` and hand out
  `files.publicUrl(name)`.
- Anyone who can reach the service can upload and delete files. Put it behind
  your app's authentication before exposing it.
