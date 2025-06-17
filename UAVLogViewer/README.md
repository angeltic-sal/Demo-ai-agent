# UAV Log Viewer

![log seeking](preview.gif "Logo Title Text 1")

 This is a Javascript based log viewer for Mavlink telemetry and dataflash logs.
 [Live demo here](http://plot.ardupilot.org).

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

# Docker

run the prebuilt docker image:

``` bash
docker run -p 8080:8080 -d ghcr.io/ardupilot/uavlogviewer:latest

```

or build the docker file locally:

``` bash

# Build Docker Image
docker build -t nachikethmamidi/uavlogviewer .

# Run Docker Image
docker run -e VUE_APP_CESIUM_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiOWYyM2ZjNy04MzgzLTQ2MjQtOWQ3Ny0yZDhhZTMyNjUyNTIiLCJpZCI6MzA4NjgxLCJpYXQiOjE3NDg5ODU1MDF9.XbPDkTDQDu5w4yzUcjrJOiXL82hn8D5AOketVrBlH5s -it -p 8080:8080 -v ${PWD}:/usr/src/app nachikethmamidi/uavlogviewer

# Navigate to localhost:8080 in your web browser

# changes should automatically be applied to the viewer

```
