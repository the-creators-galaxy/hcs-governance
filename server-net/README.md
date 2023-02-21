
# Title

HCS Governance API (.NET implementation)

## Description

This project contains a read only API services reducing the results of HCS messages into a logical current state. The current implementation reads the entire record of a HCS topic, applies business logic to each message, and then updates the list of ballots, votes etc. as appropriate.

### Disclaimer

> This is alpha software. It has not been audited. *Use at your own risk.*

## Technologies

- [.NET](https://dotnet.microsoft.com/en-us/)
- [Hashgraph .NET SDK](https://github.com/bugbytesinc/Hashgraph)

## Getting started

These are instructions for running the validation server locally, without a web interface.

1. `git clone https://github.com/the-creators-galaxy/hcs-governance` 
2. `cd hcs-govnernace/server-net`
3. `dotnet restore`
4. `dotnet run`
5. `npm run start:dev`
6. Navigate a browser to one of the URLs identified in the output appended with `/swagger` to access the project’s OpenAPI user interface.

You may wish to adjust the `appsettings.json` or `launchsettings.json` files to address different HCS voting streams.