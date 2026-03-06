const {
    makeContractCall,
    broadcastTransaction,
    uintCV,
    stringAsciiCV,
    principalCV,
    fetchCallReadOnlyFunction,
    cvToJSON
} = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');
const { generateWallet } = require('@stacks/wallet-sdk');
const fs = require('fs');
const path = require('path');

const CONTRACT_ADDRESS = 'SP3BHPVZEKANVD62KDME41G0E02KGPMKRANWF5PQK';
const CONTRACT_NAME = 'payeer';

const NAMES = ['Alice', 'Bob', 'Charlie', 'Divine', 'Grace', 'Hope', 'Joy', 'Leo', 'Max', 'Nina'];
const REASONS = ['Lunch', 'Coffee', 'Dinner', 'Movie', 'Gifts', 'Drinks', 'Taxi', 'Party'];

async function getSessionCounter() {
    try {
        const result = await fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'get-session-counter',
            functionArgs: [],
            network: STACKS_MAINNET,
            senderAddress: CONTRACT_ADDRESS,
        });
        const json = cvToJSON(result);
        return Number(json.value.value);
    } catch (e) {
        console.error('Error fetching session counter:', e.message);
        return 0;
    }
}

async function run() {
    const envPath = path.resolve(__dirname, '../../.env');
    const secretKey = fs.readFileSync(envPath, 'utf8').trim().split('\n').pop().trim();
    const wallet = await generateWallet({ secretKey, password: 'p' });
    const privateKey = wallet.accounts[0].stxPrivateKey;
    const senderAddress = CONTRACT_ADDRESS;

    console.log(`Starting interactions from ${senderAddress}...`);

    while (true) {
        try {
            const counter = await getSessionCounter();
            const functions = ['create-session'];
            if (counter > 0) {
                functions.push('add-participant');
                functions.push('resolve-session');
            }

            const func = functions[Math.floor(Math.random() * functions.length)];
            let txOptions;

            console.log(`\nPicked function: ${func}`);

            if (func === 'create-session') {
                txOptions = {
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'create-session',
                    functionArgs: [
                        uintCV(Math.floor(Math.random() * 100)),
                        stringAsciiCV(REASONS[Math.floor(Math.random() * REASONS.length)])
                    ],
                    senderKey: privateKey,
                    network: STACKS_MAINNET,
                    anchorMode: 1,
                    fee: 25600n,
                };
            } else if (func === 'add-participant') {
                const sessionId = Math.floor(Math.random() * counter) + 1;
                txOptions = {
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'add-participant',
                    functionArgs: [
                        uintCV(sessionId),
                        stringAsciiCV(NAMES[Math.floor(Math.random() * NAMES.length)]),
                        principalCV(senderAddress)
                    ],
                    senderKey: privateKey,
                    network: STACKS_MAINNET,
                    anchorMode: 1,
                    fee: 25600n,
                };
            } else if (func === 'resolve-session') {
                const sessionId = Math.floor(Math.random() * counter) + 1;
                txOptions = {
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'resolve-session',
                    functionArgs: [
                        uintCV(sessionId),
                        principalCV(senderAddress)
                    ],
                    senderKey: privateKey,
                    network: STACKS_MAINNET,
                    anchorMode: 1,
                    fee: 25600n,
                };
            }

            const transaction = await makeContractCall(txOptions);
            const response = await broadcastTransaction({ transaction, network: STACKS_MAINNET });

            if (response.txid) {
                console.log(`✅ Success! TxID: ${response.txid}`);
                console.log(`https://explorer.hiro.so/txid/0x${response.txid}?chain=mainnet`);
            } else {
                console.error(`❌ Failed: ${response.error} - ${response.reason || ''}`);
            }

        } catch (e) {
            console.error(`⚠️ Exception: ${e.message}`);
        }

        const interval = Math.floor(Math.random() * (7 - 1 + 1) + 1);
        console.log(`Sleeping for ${interval} minutes...`);
        await new Promise(resolve => setTimeout(resolve, interval * 60 * 1000));
    }
}

run().catch(console.error);
