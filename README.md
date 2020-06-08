# Mobile application
Repository to develop the mobile applications of MyLife monitoring system, using React Native.

## Directories Usage

 * Assets -> assets to be used in project
 * Data -> Harcoded data, before calling APIs
 * Screens -> Baseline Screen JS files
 * Components -> Store here custom made components
 * Constants -> Constants like style and such, should always import from here

## How to run this project

As with all the other MyLife components, this software module is packed into a [docker](https://docker.com) container, which concentrates all the development dependencies, allowing for a quick setup and build process.

You can set everything up for this component using
```bash
docker-compose up
```
(assuming you have `docker` and `docker-compose` installed, and have some basic knowledge about these tools)

As this is built using **React Native**, it is important that you take a look at the console logs for a QR code which will allow you to download the application using **Expo**.
