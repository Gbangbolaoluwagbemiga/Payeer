import { generateWallet } from '@stacks/wallet-sdk';
import { getAddressFromPrivateKey, TransactionVersion } from '@stacks/transactions';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const envContent = fs.readFileSync(path.resolve(__dirname, '../../.env'), 'utf8').trim();
    const secretKey = envContent.split('\n').pop()?.trim() || '';

    console.log("Checking accounts for seed phrase.");
    try {
        const wallet = await generateWallet({
            secretKey: secretKey,
            password: 'password'
        });

        for (let i = 0; i < 5; i++) {
            const privateKey = wallet.accounts[i].stxPrivateKey;
            const address = getAddressFromPrivateKey(privateKey, TransactionVersion.Mainnet);
            console.log(`Account ${i} Address: ${address}`);
            console.log(`Account ${i} Private Key: ${privateKey}`);
        }
    } catch (e) {
        console.error("Error generating wallet: ", e);
    }
}

main();
