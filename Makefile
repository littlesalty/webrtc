.PHONY: all

build-back:
	cd backend && npm run build

package-back: build-back
	zip backend.zip -r backend/dist/ backend/package.json

deploy-back: package-back
	./deploy-backend.sh

# build: build-back build-front