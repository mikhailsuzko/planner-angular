# planner-angular
This is a task planning frontend application written in Angular

# Project description
This is the "Task Planner" project. The source code for this project is hosted in 4 repositories. The application uses
oauth2 authorization using keycloak. There is a possibility of authorization by login and password, as well as using a
Google account.

**Components:**

1. [Frontend application](https://github.com/mikhailsuzko/planner-angular): This is where the user interface for
   managing tasks is implemented using Angular and typescript.
2. [Back for Frontend (BFF)](https://github.com/mikhailsuzko/planner-oauth2-bff): This application receives tokens from
   keycloack and passes them to the frontend. It also redirects all requests from the frontend application to the
   backend.
3. [Backend](https://github.com/mikhailsuzko/planer-microservices): Built on microservice architecture using Spring
   Cloud, Spring Cloud Config, Api Gateway, Eureka Client and Server, Spring Security, Spring Jpa, Hibernate. The
   project implements a REST Api for processing requests from the client
4. [Properties](https://github.com/mikhailsuzko/Planner-properties): Since the backend application uses Spring Cloud
   Config, all settings are stored in
   a separate repository that can be changed without the need to rebuild the backend application

**Additional Notes:**

- The project uses keycloak for authentication and authorization.
- The frontend application is built with Angular and typescript.
- The backend application is built on microservice architecture using Spring Cloud.
- The project uses a REST Api for processing requests from the client.
- All settings are stored in a separate repository.

# AngularOauth2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
