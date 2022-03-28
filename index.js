const SHA256 = require('crypto-js/sha256')


const MINE_DIFFICULTY = 5;

class Transaction {
    constructor(fromAddress, toAddress, amount){
        this.fromAddress= fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash){
        this.timestamp= timestamp;
        this.transactions=transactions;
        this.previousHash=previousHash;
        this.hash=this.calculateHash()
        this.nonce = 0; //nonce - a random value to help us with unique hashes on multiple encryptions
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString()
    }

    mineBlock(difficulty){
        // Mining Block
        // Encrypting and generating a new hash everytime, until we get no of 0s specified in the hash
        console.log(this)
        while(this.hash.substring(0,difficulty)!=Array(difficulty+1).join("0")){
            this.hash = this.calculateHash();
            this.nonce++; // nonce of unique hash result on each loop
        }
        console.log(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce)
        console.log('Block is Mined : '+ this.hash)
    }
}

class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.pendingTrasactions = []
        this.minerRewards = 20 //reward a miner will get if mannges to mine the transaction
    }

    createGenesisBlock(){
        //The Genesis Block, or Block 0, is the very first block upon which additional blocks in a blockchain are added. 
        return new Block('14/07/1993', ["Genisis Block"], "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1]
    }
    
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(MINE_DIFFICULTY)
        this.chain.push(newBlock)
    }

    minePendingTransactions(minerWalletAddress){
        let block = new Block(Date.now(), this.pendingTrasactions)
        block.mineBlock(MINE_DIFFICULTY)
        console.log('Block is mined succesfully!')
        this.chain.push(block)

        this.pendingTrasactions = []

        // Rewarding the miner for mining the block succesfully.
        // So adding the reward to pending transaction
        let rewardMinerTransaction = new Transaction(null, minerWalletAddress, this.minerRewards)
        this.pendingTrasactions.push(rewardMinerTransaction)
    }

    createTransaction(newTransaction){
        this.pendingTrasactions.push(newTransaction)
    }

    getBalanceOfWalletAddress(address){
        // Get wallet balance of adress
        let balance = 0

        for(let block of this.chain){
            for(let transaction of block.transactions){
                if(transaction.toAddress == address){
                    balance = balance + transaction.amount
                }
                if(transaction.fromAddress == address){
                    balance = balance - transaction.amount
                }
            }
        }
        console.log('Wallet balance of address : '+address+' is amount : '+ balance)
        return balance
    }

    isChainValid(){
        for(let i=1; i<this.chain.length;i++){
            let currentBlock = this.chain[i]
            let previousBlock = this.chain[i-1]

            if(currentBlock.previousHash!=previousBlock.hash){
                // Block doesn't point to correct previous block hash
                return false
            }
        }
        return true
    }
}


let saratCoin = new Blockchain()


// ----- Playing with Blocks -----

// Adding blocks with each transaction
saratCoin.addBlock(new Block("14/07/1996", [new Transaction('my-address', 'your-address', 100)]))
saratCoin.addBlock(new Block("14/07/1997", [new Transaction('your-address', 'my-address', 100)]))

console.log(JSON.stringify(saratCoin,null,4))



// ----- Playing with Transactions -----

let minerWalletAddress = 'random-miner-wallet-address'
saratCoin.createTransaction(new Transaction('address1', 'address2', 100))
saratCoin.createTransaction(new Transaction('address1', 'address2', 100))
saratCoin.createTransaction(new Transaction('address2', 'address1', 50))

// mining all transactions first time
saratCoin.minePendingTransactions(minerWalletAddress)

console.log(JSON.stringify(saratCoin,null,4))

// mining all transactions second time to get minder address also
saratCoin.minePendingTransactions(minerWalletAddress)
//Miner is rewarded the miner reward and is recorded in the transaction
console.log('Wallet Balance of the miner', saratCoin.getBalanceOfWalletAddress(minerWalletAddress))




console.log('Is BlockChain valid? : ',saratCoin.isChainValid())

// Trying to Tamper
console.log('Trying to Tamper Coin')
saratCoin.chain[1] = new Block("14/07/1996", [new Transaction('my-address', 'your-address', 700)])
saratCoin.chain[1].mineBlock(MINE_DIFFICULTY)
// It will return false because the manipulation in transactions will result to mismatch of hash generated
console.log('Is BlockChain valid? : ',saratCoin.isChainValid())
