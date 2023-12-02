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

const {GENESIS_DATA} = require('./config')

class Block {
  constructor({timestamp, lastHash, hash, data}){
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  static genesis(){
    return new Block(GENESIS_DATA)
  }

  static mineBlock({lastBlock, data}){
    return new this ({
      timestamp: Date.now(),
      lastHash: lastBlock.hash,
      data: data,
    })
  }
}

module.exports = Block;
