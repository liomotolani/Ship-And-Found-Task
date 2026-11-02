import { hashPassword, verifyPassword } from '../lib/password';

const password = 'correct horse battery staple';

async function main() {
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    console.log(`Password: ${password}`);
    console.log(`Hashed with VetReply's own hashPassword (lib/password.ts)`);
    console.log('');
    console.log(`Hash 1: ${hash1}`);
    console.log(`Hash 2: ${hash2}`);
    console.log('');
    console.log(`Same hash?            ${hash1 === hash2}`);
    console.log(`Hash 1 verifies:      ${await verifyPassword({ hash: hash1, password })}`);
    console.log(`Hash 2 verifies:      ${await verifyPassword({ hash: hash2, password })}`);
    console.log(`Wrong password works? ${await verifyPassword({ hash: hash1, password: 'wrong password' })}`);
    console.log('');
    console.log(`Salt in hash 1: ${hash1.split('$')[4]}`);
    console.log(`Salt in hash 2: ${hash2.split('$')[4]}`);
}

main();