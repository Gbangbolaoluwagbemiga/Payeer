const { generateWallet, generateNewAccount } = require('@stacks/wallet-sdk');
const { makeContractDeploy, broadcastTransaction } = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');
const fs = require('fs');
const path = require('path');

async function main() {
    const envPath = path.resolve(__dirname, '../.env');
    const secretKey = fs.readFileSync(envPath, 'utf8').trim().split('\n').pop().trim();

    let wallet = await generateWallet({ secretKey, password: 'p' });
    const network = STACKS_MAINNET;
    const codeBody = fs.readFileSync(path.resolve(__dirname, '../backend/contracts/payeer.clar'), 'utf8');

    console.log('Attempting deployment across 20 accounts...');

    for (let i = 0; i < 20; i++) {
        if (i >= wallet.accounts.length) {
            wallet = generateNewAccount(wallet);
        }
        const privateKey = wallet.accounts[i].stxPrivateKey;

        const txOptions = {
            contractName: 'payeer',
            codeBody,
            senderKey: privateKey,
            network,
            fee: 25600n,
            anchorMode: 1,
            clarityVersion: 3,
        };

        try {
            const transaction = await makeContractDeploy(txOptions);
            // v7 API: broadcastTransaction takes { transaction, network }
            const resp = await broadcastTransaction({ transaction, network });

            if (resp && resp.txid) {
                console.log(`\n✅ Deployed from Account ${i}!`);
                console.log(`TxID: ${resp.txid}`);
                console.log(`Explorer: https://explorer.hiro.so/txid/${resp.txid}?chain=mainnet`);
                return;
            } else if (resp && resp.error) {
                console.log(`Account ${i}: ${resp.error} - ${resp.reason || ''}`);
                if (resp.error === 'ContractAlreadyExists') {
                    console.log('Contract already deployed!');
                    return;
                }
            } else {
                console.log(`Account ${i}: Unexpected response`, resp);
            }
        } catch (e) {
            console.log(`Account ${i}: Error - ${e.message}`);
        }
    }
    console.log('Done.');
}

main();
