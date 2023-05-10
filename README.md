# appert-shopping


## Links

### CI/CD
Scripts to run in CI/CD are provided in `ci/scripts`

___
## **Folder Structure**

- **src/api**: routes and controllers for api endpoints
- **src/models**: definitions of data structure
- **src/services**: contains business logic that may be shared amongst routes
- **src/utils**: contains commonly used functions or parsers used throughout the application
- **src/test**: contains test utilities

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
