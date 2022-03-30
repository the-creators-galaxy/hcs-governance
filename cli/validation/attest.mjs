import { attest } from './lib/index.mjs';

try {
    if (process.argv.length !== 4) {
        throw Error("Usage: node attest <https://mirror.node.url> <proposal id>");
    }
    const attestation = await attest(process.argv[2], process.argv[3]);
    console.dir(attestation);
} catch (err) {
    console.error(err.message || err.toString());
    process.exit(1);
}
