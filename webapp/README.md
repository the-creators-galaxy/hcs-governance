## Title 

HCS Governance Web Application 

## Description 

This is a static client-side single page web application implemented using the [Vue.js](https://vuejs.org) framework. It provides an easy to use interface for viewing governance ballots, creating new ballots, voting, and viewing results.

This is a static single page web application.  The docker image defaults to a simple nginx image acting as the http webserver, although nearly any capable server would suffice.  It should be noted that the endpoint for the API service the user interface must be specified at build time and is hard coded into the assets produced by the build toolchain.  (This makes it deployable to any static hosting service without further configuration or service dependencies). The environmental build variables that affect the configured endpoint are `WEBAPP_API_ENDPOINT` and/or `SERVER_API_PORT` please see the 
`example.env` file for additional documentation of these build variables.

Note that users can use a hosted instance of this software, run it locally, or interact with the Hedera network directly. They do not need to utilize any of this software, as long as their interactions adhere to the standards defined within CGIP-4.

### Disclaimer

> This is alpha software. It has not been audited. *Use at your own risk.*

## Technologies

- [Vue.js](https://vuejs.org)
- [Node.js](https://nodejs.org/en/)
- [TypeScipt](https://www.typescriptlang.org)
- [Hedera's protobufs](https://www.npmjs.com/package/@hashgraph/proto)

## Getting started

These are instructions for running the web application by itself, without an API endpoint.

1. `git clone https://github.com/the-creators-galaxy/hcs-governance` 
2. `cd hcs-govnernace/webapp`
3. `cp sample.env .env`
4. `npm ci`
5. `npm run dev`
6. `visit http://localhost:3000 in your web browser`

However, you will likely want to run the entire project form it's root directory, via the Docker config. 