.PHONY: all

build-back:
	cd backend && npm run build

package-back: build-back
	zip backend.zip -r backend/dist/ backend/package.json

deploy-back: package-back
	./deploy-backend.sh


build-front:
	cd frontend && npm run build:prod

package-front: build-front
	zip frontend.zip -r frontend/dist/

deploy-front: package-front
	./deploy-frontend.sh


build: build-back build-front
	echo "Done ✅"