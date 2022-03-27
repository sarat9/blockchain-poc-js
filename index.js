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
    }

    createGenesisBlock(){
        //The Genesis Block, or Block 0, is the very first block upon which additional blocks in a blockchain are added. 
        return new Block('14/07/1993', "Genisis Block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1]
    }
    
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(MINE_DIFFICULTY)
        this.chain.push(newBlock)
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
saratCoin.addBlock(new Block("14/07/1996", {amount: 7}))
saratCoin.addBlock(new Block("14/07/1997", {amount: 10}))

console.log(JSON.stringify(saratCoin,null,4))

console.log('Is BlockChain valid? : ',saratCoin.isChainValid())

// trying to tamper
console.log('trying to tamper Coin')
saratCoin.chain[1] = new Block("14/07/1996", {amount: 1000})
saratCoin.chain[1].mineBlock(MINE_DIFFICULTY)
// It will return false because the manipulation in transactions will result to mismatch of hash generated
console.log('Is BlockChain valid? : ',saratCoin.isChainValid())
