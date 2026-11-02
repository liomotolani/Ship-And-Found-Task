import { scrypt, timingSafeEqual } from 'node:crypto';
import {
  hash as argon2Hash,
  verify as argon2Verify,
} from '@node-rs/argon2';

function deriveScryptKey(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password,
      salt,
      64,
      {
        N: 16384,
        r: 16,
        p: 1,
        maxmem: 128 * 16384 * 16 * 2,
      },
      (error, key) => {
        if (error) {
          reject(error);
        } else {
          resolve(key);
        }
      },
    );
  });
}

export function hashPassword(password: string) {
  return argon2Hash(password.normalize('NFKC'), {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
    outputLen: 32,
  });
}

export async function verifyPassword({
  hash,
  password,
}: {
  hash: string;
  password: string;
}) {
  if (hash.startsWith('$argon2id$')) {
    try {
      return await argon2Verify(hash, password.normalize('NFKC'));
    } catch {
      return false;
    }
  }

  const parts = hash.split(':');

  if (parts.length !== 2) {
    return false;
  }

  const [salt, keyHex] = parts;

  if (!salt || !keyHex) {
    return false;
  }

  try {
    const derived = await deriveScryptKey(password.normalize('NFKC'), salt);
    const key = Buffer.from(keyHex, 'hex');

    return key.length === derived.length && timingSafeEqual(key, derived);
  } catch {
    return false;
  }
}
