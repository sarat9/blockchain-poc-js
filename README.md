# blockchain-poc-js
Simple Blockchain POC with basic concepts 


- Blockchain
- Blocks
- Transactions
- Encryption to hash
- Proof of concept
- Mining
- Nonce value
- Tamper Check



### Genesis Block
The Genesis Block, also known as Block 0, is the very first block upon which additional blocks in a blockchain are added. It is effectively the ancestor that every other block can trace its lineage back to since every block references the one preceding it.


### Proof Of Work or Proof of State
Proof-of-work is the mechanism that allows the decentralized Ethereum network to come to consensus, or agree on things like account balances and the order of transactions. This prevents users from "double spending" their coins and ensures that the Ethereum chain is tremendously difficult to attack or manipulate.

#### Concept

For a particular block as we keep adding a pervious hash as link and generate a hash from the data.
Though we can validate if a paticular block is tampered from the hash, if the hacker has enough computational power, he will be able to tamper all the block and calculate the hashes.
Proof of Work eliminates it with mining concept. 
Example: A hash is valid only if it has three 0s at start. And for that to happen it will need to keep on ecrypting it until it manages to get such a hash with the no of 0s. this process is called mining. and it will make it difficult to compute for all of the blocks in the chain.
And encrypting the same block data will always give the same hash, so to make the encryption result/hash to change everytime we calculate, we need a random value that changes included in the data which is called a nonce value.