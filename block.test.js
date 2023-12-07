const Block = require('./block');
const {GENESIS_DATA, MINE_RATE} = require('./config');
const cryptoHash = require('./crypto-hash');
const hexToBinary = require('hex-to-binary');

describe('Block', ()=> {
  const timestamp = 2000;
  const lastHash = 'foo-lastHash';
  const hash = 'bar-hash';
  const data = ['bookchain', '7584', 'data', '147852'];
  const difficulty = 1;
  const nonce = 1;

  const block = new Block ({
    timestamp: timestamp,
    lastHash: lastHash,
    hash: hash,
    data: data,
    difficulty,
    nonce,
  });

  it('has 4 property timestamp, lastHash, hash and data', ()=>{
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.difficulty).toEqual(difficulty);
    expect(block.nonce).toEqual(nonce);
  })



  describe('genesis()', () => {
    const genesisblock = Block.genesis();
    it('returns a block instance', () => {
      expect(genesisblock instanceof Block).toEqual(true);
    })

    it('returns the genesis data', () => {
      expect(genesisblock).toEqual(GENESIS_DATA);
    })
  })

  describe('mineBlock()', () => {
    const lastBlock = Block.genesis();
    const data = 'mined data';
    const minedBlock = Block.mineBlock({ lastBlock, data });

    it('returns a block instance?', () => {
      expect(minedBlock instanceof Block).toEqual(true);
    });

    it('sets lastHash to the hash lastBlock?', () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it('sets data?', () => {
      expect(minedBlock.data).toEqual(data);
    });

    it('sets timestamp?', () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it('create sha256 hash base on inputs', () => {
      expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp, minedBlock.nonce, minedBlock.difficulty, lastBlock.hash, data));
    });

    it('sets a hash that makes the difficulty criteria', () => {
      expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty))
    });

    it('adjusts the difficulty', () => {
      const posibleResult = [lastBlock.difficulty + 1, lastBlock.difficulty - 1 ];
      expect(posibleResult.includes(minedBlock.difficulty)).toBe(true);
    })
  });

  describe('adjustDifficulty', () => {
    it('raises the difficulty for a quickly mined block', () => {
      expect(Block.adjustDifficulty({
        originalBlock: block,
        timestamp: block.timestamp + MINE_RATE - 100
      })).toEqual(block.difficulty + 1)
    });
    it('lower the difficulty for a slowly mined block', () => {
      expect(Block.adjustDifficulty({
        originalBlock: block,
        timestamp: block.timestamp + MINE_RATE + 100
      })).toEqual(block.difficulty - 1)
    });

    it('has a lower limit of 1', () => {
      block.difficulty = -1;
      expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1);
    });

  });
});


