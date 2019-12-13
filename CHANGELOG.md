# Changelog

## 2.0.5 - 2019.12.13

- Updated all referenced packages
- Updated test backend to .NET Core 3.1
- Migrated to Google TypeScript Style (Yes I did a lot of C# before ;-) )
- Updated meaningless parameter name `guid` to `requestId`
- Made request body type safe

## 2.0.4 - 2019.11.27

- Updated all referenced packages
- Fixed Azure AD Token provider to throw an error if no token could be retrieved

## 2.0.3 - 2019.10.21

- Fixed again Application Insights logger

## 2.0.2 - 2019.10.21

- Fixed Application Insights logger

## 2.0.1 - 2019.10.17

This version includes **breaking API changes**

- New logging builder API
- Added Azure Application Insights Logger
- Simplified memory cache by using a new cache entry model
- Circuit Breaker has now a leaking bucket algorithm to take note of failures
- Maintenance mode added to all pipelines
- Added a unique Id to all requests for better logging information
- Added a baseline proxy that calculates an alarm level from request duration samples and sends warning messages to a logger if request duration is above this level
- Fixed wrong minute timespans

## 1.2.2 - 2019.09.30

- Fixed request URL logging to always include base URL
- Added request duration log output to debug log level

## 1.2.1 - 2019.09.30

- Console Logger output now writes log level before time stamp
- Added response type and query params to Axios request builders
- Added a multi logger that is a container for several other loggers
- Added logging of request URL

## 1.1.1 - 2019.09.29

- Initial public release
