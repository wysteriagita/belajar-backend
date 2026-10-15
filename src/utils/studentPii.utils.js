import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
} from 'node:crypto';
import appError from './appError.utils.js';

const ALGORITHM = 'aes-256-gcm';
const ENVELOPE_VERSION = 'v1';
const IV_LENGTH = 12;

const getKey = (environmentName) => {
  const encodedKey = process.env[environmentName];

  if (!encodedKey) {
    throw new appError(500, `${environmentName} is not configured`);
  }

  const key = Buffer.from(encodedKey, 'base64');
  if (key.length !== 32 || key.toString('base64') !== encodedKey) {
    throw new appError(
      500,
      `${environmentName} must be a base64-encoded 32-byte key`
    );
  }

  return key;
};

const encryptStudentPii = (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(
    ALGORITHM,
    getKey('STUDENT_PII_ENCRYPTION_KEY'),
    iv
  );
  const ciphertext = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    ENVELOPE_VERSION,
    iv.toString('base64'),
    authTag.toString('base64'),
    ciphertext.toString('base64'),
  ].join('.');
};

const decryptStudentPii = (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  const [version, encodedIv, encodedAuthTag, encodedCiphertext, ...extra] =
    value.split('.');

  if (
    version !== ENVELOPE_VERSION ||
    !encodedIv ||
    !encodedAuthTag ||
    !encodedCiphertext ||
    extra.length > 0
  ) {
    throw new appError(
      500,
      'Stored student sensitive data has an invalid format'
    );
  }

  try {
    const decipher = createDecipheriv(
      ALGORITHM,
      getKey('STUDENT_PII_ENCRYPTION_KEY'),
      Buffer.from(encodedIv, 'base64')
    );
    decipher.setAuthTag(Buffer.from(encodedAuthTag, 'base64'));

    return Buffer.concat([
      decipher.update(Buffer.from(encodedCiphertext, 'base64')),
      decipher.final(),
    ]).toString('utf8');
  } catch (error) {
    if (error instanceof appError) {
      throw error;
    }

    throw new appError(
      500,
      'Unable to decrypt student sensitive data; check the encryption key'
    );
  }
};

const hashStudentPii = (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  return createHmac('sha256', getKey('STUDENT_PII_HASH_KEY'))
    .update(value, 'utf8')
    .digest('hex');
};

export { encryptStudentPii, decryptStudentPii, hashStudentPii };
