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
VUE_APP_GOOGLE_API_KEY=AIzaSyAoE0HY9rR_o3a9J7UpKxSAJc6ecHVuYMk
VUE_APP_GOOGLE_ANALYTICS_ID=G-9JJ4JPW6RV
VUE_APP_WS_URI=ws://127.0.0.1:2140
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
