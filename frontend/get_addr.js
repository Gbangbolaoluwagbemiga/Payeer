const { generateWallet } = require('@stacks/wallet-sdk');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        const secretKey = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8').trim().split('\n').pop().trim();
        const w = await generateWallet({ secretKey, password: 'p' });
        console.log('Mainnet Addresses:');
        w.accounts.forEach((a, index) => {
            console.log(`Account ${index}: ${a.mainnetAddress}`);
        });
        console.log('Matches User Address:', w.accounts.some(a => a.mainnetAddress === 'SP3BHPVZEKANVD62KDME41G0E02KGPMKRANWF5PQK'));
    } catch (e) {
        console.error(e);
    }
}
main();
