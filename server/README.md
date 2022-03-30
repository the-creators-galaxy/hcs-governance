
# Title

HCS Governance API 

## Description

This project contains a read only API services reducing the results of HCS messages into a logical current state. The current implementation reads the entire record of a HCS topic, applies business logic to each message, and then updates the list of ballots, votes etc. as appropriate.

The server makes the rolled-up state of the system avaialble thru a read-only REST interface exposed as configured thru the environmental variable `SERVER_API_PORT`.

It also relies on other environmental variables (found in the `.env` file) identifying
which network to connect to, and the topic to subscribe to and token to filter with.

### Disclaimer

> This is alpha software. It has not been audited. *Use at your own risk.*

## Technologies

- [Node.js](https://nodejs.org/en/)
- [Nest.js](https://nestjs.com)
- [grpc-js](https://www.npmjs.com/package/@grpc/grpc-js)
- [TypeScript](https://www.typescriptlang.org)
- [Hedera's protobuf](https://www.npmjs.com/package/@hashgraph/proto)

## Getting started

These are instructions for running the validation server locally, without a web interface.

1. `git clone https://github.com/the-creators-galaxy/hcs-governance` 
2. `cd hcs-govnernace/server`
3. `cp sample.env .env`
4. `npm ci`
5. `npm run start:dev`
6. `visit http://localhost:3001/api/v1/info in your web browser or view logs in your console`

However, you will likely want to run the entire project form it's root directory, via the Docker config. 