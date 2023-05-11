# appert-shopping
[![Coverage Status](https://img.shields.io/coveralls/github/nalbion/appert-shopping/master.svg)](https://coveralls.io/r/nalbion/appert-shopping?branch=master)

- Each user is automatically assigned a `cartId` cookie which is used in subsequent requests.
- The shopping cart API supports promotions which can be externally configured.
 Various instances of `freebie` etc can be configured, and new promotion types can be added without modifications to the `PromotionsService` code.

## TODO
- authorisation - users should be able to (optionally) log in and access the cart they were using anonymously or from a different device.
- checkout & payment
- load/persist to DB, database migration schemas
- atomic DB transactions on take/return item from inventory
- CI/CD pipeline (most supporting scripts are provided)
- Monitor [http://localhost:9020/api/health](http://localhost:9020/api/health) & update to ping DB. If the optional query string `?version=0.0.1` does not match the build version a HTTP status `409` is returned.

## Usage

This application has been deployed to [https://appert-shopping.herokuapp.com/swagger](https://appert-shopping.herokuapp.com/swagger)

```bash
docker build -t nalbion/appert-shopping .
docker run --rm -p 9020:9020 nalbion/appert-shopping
```

Alternatively, use the npm scripts:

```bash
npm run docker:build
npm run docker:run
```

When running, API documentation is available at [http://localhost:9020/swagger](http://localhost:9020/swagger). Example requests are provided in the "Try it out" sections.

The schema `appert-shopping-api.yml` is generated by `npm run generate-schema` and is also available at [http://localhost:9020/swagger/spec](http://localhost:9020/swagger/spec).

### Development

```bash
npm install
npm run test:tdd
```

or

```bash
npm run start:dev
```

IntelliJ users can execute requests from `shopping-cart.http`


## CI/CD
Scripts to run in CI/CD are provided in `ci/scripts`

___
## **Folder Structure**

- **src/api**: routes and controllers for api endpoints
- **src/models**: definitions of data structure
- **src/service**: contains business logic that may be shared amongst routes

___
## **Getting Started**

- Need a database? Consider [Prisma](https://www.prisma.io/)

### Prerequisites

- NPM 6
- [Typescript](https://www.typescriptlang.org/)


### Running on localhost

Create an environment (**.env**) file by copying the (**.env.example**) and replacing empty variables.

___
## **Testing**
### Lint
    $ npm run lint
    $ npm run format

or, do it all together as the pre-commit hook does:

    $ npm run format:lint:fix

### Unit Tests
    $ npm test

### Coverage Report
    $ npm run coverage

___
## Technology
- [Typescript](https://www.typescriptlang.org) - Typescript transpiler
- [Swagger](https://swagger.io/) - API Specification (Version 3)
- [Mocha](https://github.com/mochajs/mocha) - Unit testing framework
- [Chai](https://github.com/chaijs/chai) - Unit testing assertions
- [Istanbul](https://istanbul.js.org) - Code coverage
- [ChanceJS](https://chancejs.com/) - Values random generator for unit testing
- [Open API Generator](https://github.com/OpenAPITools/openapi-generator) - Swagger code generation
- [Helmet](https://github.com/helmetjs/helmet) - Security headers

___
## Best Practices and Coding Patterns
- [Clean Code](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29)
