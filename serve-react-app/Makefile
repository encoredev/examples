assets := $(wildcard hello/*)

run: $(assets)
	cd hello/assets && npm run build -- --watch&
	encore run

build: $(assets)
	cd hello/assets && NODE_ENV=production npm run build
	encore run

test: $(assets)
	cd hello/assets && npm run build
	encore test ./...