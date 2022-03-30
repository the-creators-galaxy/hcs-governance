
# Title

HCS Governance CLI

## Description

Currently there are cli tools written in both [TypeScipt](https://www.typescriptlang.org) and [.NET](https://docs.microsoft.com/en-us/dotnet/?WT.mc_id=dotnet-35129-website) that can be used to validate that the system works as intended, regardless of what client you are using to interact with the Hedera network. Notably because users can interact with the Hedera network directly and do not need to utilize any of this software (as long as their interactions adhere to the standards defined within CGIP-4) making multi-client validation increasingly valuable and interesting.

## How it works

This tool looks up a specific ballot, validates that is adheres to the standards defined within CGIP-4. Next it gather's all votes within the timestamp/voting window, and validates them against the standards defined within CGIP-4. It will then compute the winning vote, and a checksum of all the data parsed so far - which should match the user interface presented within the web application's UI, as well as the cli that is written in another language, to ensure consistent results.

### Disclaimer

> This is alpha software. It has not been audited. *Use at your own risk.*

## Technologies

#### .NET

- [.NET Core, 0.6.0 or greater](https://dotnet.microsoft.com/en-us/download)

#### TypeScript

- [Node.js](https://nodejs.org/en/)
- [rollup.js](http://rollupjs.org)

## Getting started

#### .NET
1. `git clone https://github.com/the-creators-galaxy/hcs-governance` 
2. `cd hcs-govnernace/cli/validation-net`
3. `dotnet run <MIRROR_NODE_API_ENDPOINT> <PROPOSAL_ID>`

#### TypeScript
1. `git clone https://github.com/the-creators-galaxy/hcs-governance` 
2. `cd hcs-govnernace/cli/validation`
3. `npm ci`
4. `npm run build`
5. `node attest.mjs ${MIRROR_NODE_API_ENDPOINT} ${PROPOSAL_ID}`