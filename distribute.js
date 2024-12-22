const ethers = require('ethers');
const csv = require('csv-parse');
const fs = require('fs');
require('dotenv').config();

const contractABI = [{
    "inputs": [
        {
            "internalType": "address[]",
            "name": "recipients",
            "type": "address[]"
        },
        {
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
        }
    ],
    "name": "distributeUCASH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}];

async function readCSV() {
    const records = [];
    const parser = fs
        .createReadStream('recipients.csv')
        .pipe(csv.parse({
            columns: true,
            skip_empty_lines: true
        }));

    for await (const record of parser) {
        records.push(record);
    }
    return records;
}

async function distributeUCASH() {
    try {
        // Read CSV data
        console.log("Reading recipients from CSV...");
        const recipients = await readCSV();
        
        // Separate addresses and amounts
        const addresses = recipients.map(r => r.address);
        const amounts = recipients.map(r => 
            ethers.utils.parseUnits(r.amount.toString(), 18)
        );

        // Connect to network
        const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        // Connect to contract
        const contractAddress = "";
        const distributor = new ethers.Contract(contractAddress, contractABI, wallet);

        console.log(`Preparing to send to ${addresses.length} recipients...`);
        console.log("First few recipients:");
        for (let i = 0; i < Math.min(3, addresses.length); i++) {
            console.log(`${addresses[i]}: ${ethers.utils.formatUnits(amounts[i], 18)} UCASH`);
        }

        // Send transaction
        console.log("\nSending distribution transaction...");
        const tx = await distributor.distributeUCASH(addresses, amounts);
        console.log("Transaction hash:", tx.hash);

        console.log("Waiting for confirmation...");
        const receipt = await tx.wait();
        console.log("Transaction confirmed in block:", receipt.blockNumber);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Run the distribution
distributeUCASH()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });