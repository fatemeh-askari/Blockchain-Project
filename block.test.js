const Block = require('./block');
const {GENESIS_DATA} = require('./config');
const cryptoHash = require('./crypto-hash');

describe('Block', ()=> {
  const timestamp = '12345';
  const lastHash = 'foo-lastHash';
  const hash = 'bar-hash';
  const data = ['bookchain', '7584', 'data', '147852']

  const block = new Block ({
    timestamp: timestamp,
    lastHash: lastHash,
    hash: hash,
    data: data
  });

  it('has 4 property timestamp, lastHash, hash and data', ()=>{
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
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
      expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data));
    });
  });
});


