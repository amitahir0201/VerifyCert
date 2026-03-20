import crypto from 'crypto';

export const generateCertificateId = () => {
    // Generate a random 8-character hex string as a certificate ID
    return crypto.randomBytes(4).toString('hex').toUpperCase();
};
