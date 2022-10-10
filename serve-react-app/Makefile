assets := $(wildcard hello/*)

run: $(assets)
	npm --prefix hello/assets run build -- --watch&
	encore run

build: $(assets)
	cd hello/assets && NODE_ENV=production npm run build
	NODE_ENV=production npm --prefix hello/assets run build

test: $(assets)
	npm --prefix hello/assets run build
	encore test ./...