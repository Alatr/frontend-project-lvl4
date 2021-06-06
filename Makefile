install:
	npm install

start:
	heroku local -f Procfile.dev

start-backend:
	npx nodemon bin/slack.js

start-frontend:
	npx webpack serve

install-deps:
	npm ci

build:
	npm run build

lint:
	npx eslint . --ext js,jsx

lint-fix:
	npx eslint . --ext js,jsx --fix

publish:
	npm publish

deploy:
	git push heroku

test:
	npm test
	
test-coverage:
	npm test -- --coverage --coverageProvider=v8


