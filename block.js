// class Block {
//   constructor({timestamp, lastHash, hash, data}){
//     this.timestamp = timestamp;
//     this.lastHash = lastHash;
//     this.hash = hash;
//     this.data = data;
//   }
// }

// // const block1 = new Block('1234567', 'foo-lastHash', 'foo-hash', 'foo-data');
// const block2 = new Block({
//   timestamp:'1234568', lastHash:'bar-lastHash', hash:'bar-hash', data:'bar-data'
// });
// console.log(block1);
// console.log(block2);



// TDD Approach

const {GENESIS_DATA, MINE_RATE} = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
  constructor({timestamp, lastHash, hash, data, difficulty, nonce}){
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }

  static genesis(){
    return new Block(GENESIS_DATA)
  }

  static mineBlock({lastBlock, data}){
    // const timestamp = Date.now();
    let hash, timestamp;
    const lastHash = lastBlock.hash;
    const difficulty = lastBlock.difficulty;
    // const {difficulty} = lastBlock;
    let nonce = 0;

    do{
      nonce++ ; 
      timestamp = Date.now();
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty)
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty)) 


    return new this ({
      timestamp,
      lastHash,
      data: data,
      difficulty,
      nonce,
      hash,
    })
  }

  static adjustDifficulty({originalBlock, timestamp}){
    const {difficulty} = originalBlock;
    if((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1;
    return difficulty + 1;
  }
}

module.exports = Block;
