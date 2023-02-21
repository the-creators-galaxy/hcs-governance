# Title

Hedera Governance Software

## Description

This repository contains tools that easily facilitate on-chain governance utilizing the [Hedera](https://hedera.com) public network. It leverages the [Hedera Consensus Service](https://docs.hedera.com/guides/docs/sdks/consensus) (HCS) to enable decentralized communities (like a [DAO](https://ethereum.org/en/dao/)) to vote with their account's 'weight' of fungible token holdings created on the [Hedera Token Service](https://docs.hedera.com/guides/docs/sdks/tokens) (HTS).

It is comprised of a read-only [server](/server) that computes state based off of HCS message history, and a [web application](/webapp) that enables users to easily participate in governance. Additionally it includes [cli](/cli)'s written in both [TypeScipt](https://www.typescriptlang.org) and [.NET](https://docs.microsoft.com/en-us/dotnet/?WT.mc_id=dotnet-35129-website) that can be used to validate that the system works as intended, regardless of what client you are using to interact with the Hedera network. 

### Disclaimer

> This is alpha software. It has not been audited. *Use at your own risk.*

## How it works

This software adheres to the standards defined within [CGIP-4](https://github.com/the-creators-galaxy/creators-galaxy-improvement-proposals/blob/master/CGIP/cgip-2.md) to facilitate decentralized voting utilizing the Hedera network. It leverages an HCS topic that is created without [submission keys](https://docs.hedera.com/guides/docs/sdks/consensus/create-a-topic) allowing anyone to submit messages to the topic. CGIP-4 defines the messages that need to be sent to the HCS topic to create a new proposal, vote on an existing proposal (with the weight of a specific HTS token holding), and validate the results of a proposal. While this is a convenient interface and API to utilize, notably users can interact with the Hedera network directly and do not need to utilize any of this software, as long as their interactions adhere to the standards defined within CGIP-4. 

## Quickstart

This project and it's components can be ran through [Docker](https://www.docker.com).

1. `git clone https://github.com/the-creators-galaxy/hcs-governance`
2. `cd hcs-governance`
3. `cp example.env .env`
4. `docker-compose build`
5. `docker-compose up`

Update the `.env` with which network to connect to, the HCS topic, and HTS voting token. 

#### Note

Presently there is an issue with docker compose and the format of this project that not all source
code changes are necessarily identified by docker - in order to to ensure code changes are included when starting the suite of services, include `--force-recreate` with the `docker-compose up` command. Or alternatively issue a `docker-compose build` command prior to `docker-compose up`.

#### Verify Server Instance

Open a browser at `http://localhost:3001/api/v1/info`

The results returned should contain something similar to the following:

```json
{
    "mirrorGrpc": "hcs.testnet.mirrornode.hedera.com:5600",
    "mirrorRest": "testnet.mirrornode.hedera.com",
    "htsToken": "0.0.29582024",
    "hcsTopic": "0.0.29582032",
    "lastUpdated": "1643835023.175810829"
}
```

## Contributors 

[Jason Fabritz](https://twitter.com/bugbytesinc)

[Paul Madsen](https://twitter.com/paulmadsen)

[Cooper Kunz](https://twitter.com/cooper_kunz)

## License

[MIT](/LICENSE)