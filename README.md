## Installation

#### Requirements
- NPM 6.x
- Node 10.x

#### Local dependencies
Once cloned, run the following command line.
```
npm install
```

#### Environment variables
In root folder of the project, create a .env file and paste and adjust the following settings.
```
VUE_APP_API_URL=http://server.directus.polymind.localhost
VUE_APP_WWW_URL=http://localhost:4100
VUE_APP_GOOGLE_API_KEY=AIzaSyAoE0HY9rR_o3a9J7UpKxSAJc6ecHVuYMk
VUE_APP_GOOGLE_ANALYTICS_ID=G-9JJ4JPW6RV
VUE_APP_WS_URI=ws://127.0.0.1:2140
VUE_APP_COOKIE_DOMAIN=localhost
VUE_APP_PLAYER_URL=http://localhost:4200
VUE_APP_COMPONENT_BUCKET_URL=https://polymind-component-local.s3.ca-central-1.amazonaws.com
SDK_PACKAGE_NAME=@polymind/sdk-js@https://github.com/PolymindApp/sdk-js.git#dev
```

## Launch
Run the following command to run the project in development mode.
```
npm run serve
```
In production (after a successful build), use this one instead.
```
npm run start
```

## Build
```
npm run build
```
