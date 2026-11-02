import { createHash } from 'node:crypto';
import { hashPassword } from '../lib/password';

const password = 'correct horse battery staple';
const ARGON_RUNS = 20;
const SHA_RUNS = 1_000_000;

async function main() {
    // Warm up both, so the first-call setup cost isn't counted.
    await hashPassword(password);
    createHash('sha256').update(password).digest('hex');

    // Argon2id: VetReply's own hashPassword (lib/password.ts)
    let start = performance.now();
    for (let i = 0; i < ARGON_RUNS; i++) {
        await hashPassword(password);
    }
    const argonMs = (performance.now() - start) / ARGON_RUNS;

    // SHA-256: Node's built-in crypto
    start = performance.now();
    for (let i = 0; i < SHA_RUNS; i++) {
        createHash('sha256').update(password).digest('hex');
    }
    const shaMs = (performance.now() - start) / SHA_RUNS;

    const argonPerSecond = 1000 / argonMs;
    const shaPerSecond = 1000 / shaMs;

    console.log(`Password: "${password}"`);
    console.log(`Node ${process.version}, ${process.platform} ${process.arch}`);
    console.log('');
    console.log(`Argon2id (m=65536, t=3, p=1), average of ${ARGON_RUNS} hashes:`);
    console.log(`  ${argonMs.toFixed(2)} ms per hash`);
    console.log(`SHA-256, average of ${SHA_RUNS.toLocaleString()} hashes:`);
    console.log(`  ${shaMs.toFixed(6)} ms per hash`);
    console.log('');
    console.log('Guesses per second on this machine, one core (1000 ms / ms per hash):');
    console.log(`  Argon2id: 1000 / ${argonMs.toFixed(2)} = ${argonPerSecond.toFixed(1)} guesses per second`);
    console.log(`  SHA-256:  1000 / ${shaMs.toFixed(6)} = ${Math.round(shaPerSecond).toLocaleString()} guesses per second`);
    console.log('');
    console.log(`SHA-256 is ${Math.round(shaPerSecond / argonPerSecond).toLocaleString()} times faster to guess against.`);
}

main();