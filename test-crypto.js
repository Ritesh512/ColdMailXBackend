import { encrypt, decrypt } from './utils/crypto.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const runTest = () => {
    console.log('--- Running Encryption/Decryption Test ---');

    const originalPassword = 'my-super-secret-password-123!';
    console.log('Original Text:  ', originalPassword);

    // 1. Encrypt the text
    const encryptedData = encrypt(originalPassword);
    console.log('Encrypted Hash: ', encryptedData);

    // 2. Decrypt the hash
    const decryptedPassword = decrypt(encryptedData);
    console.log('Decrypted Text: ', decryptedPassword);

    // 3. Verify the result
    console.log('\n--- Verification ---');
    const isMatch = originalPassword === decryptedPassword;
    if (isMatch) {
        console.log('✅ SUCCESS: Decrypted text matches the original.');
    } else {
        console.log('❌ FAILED: Decrypted text does not match the original.');
    }
};

runTest();