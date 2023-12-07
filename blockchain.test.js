const Block = require('./block');
const Blockchain = require('./blockchain');
const cryptoHash = require('./crypto-hash');

describe ('Blockchain', () => {
  let blockchain, newChain, originalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    originalChain = blockchain.chain;
  });

  it ('contains a chain array instance', () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });
  it ('starts withe genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });
  it ('adds a new block to the chain', () => {
    const newData = 'foo bar';
    blockchain.addBlock({data: newData});

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });


  describe('isValidChain()', () => {

    describe('when the chain does not start withe the genesis block', () => {
      it('returns false', () => {
        blockchain.chain[0] = {data: 'fake-genesis'}
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      })
    });


    describe('when the chain does start withe the genesis block and has multiple blocks', () => {
      
      // beforeEach(() =>{
      //   blockchain.addBlock({data: 'one'});
      //   blockchain.addBlock({data: 'two'});
      //   blockchain.addBlock({data: 'three'});
      // });
      
      describe('and a lastHash reference has changed', () => {
        it('returns false', () => {
          blockchain.addBlock({data: 'one'});
          blockchain.addBlock({data: 'two'});
          blockchain.addBlock({data: 'three'});
          blockchain.chain[2].lastHash = 'broken-lastHash';

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        })
      });

      describe('and the chain contains a block with invalid fields', () => {
        it('returns false', () => {
          blockchain.addBlock({data: 'one'});
          blockchain.addBlock({data: 'two'});
          blockchain.addBlock({data: 'three'});
          blockchain.chain[2].data = 'changed-data';

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        })
      });

      describe('and the chain does not contain any invalid blocks', () => {
        it('returns true', () => {
          blockchain.addBlock({data: 'one'});
          blockchain.addBlock({data: 'two'});
          blockchain.addBlock({data: 'three'});

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        })
      });

      describe('and the chain contains a block with a jumped difficulty', () => {
        it('returns false', () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];
          const lastHash = lastBlock.hash;
          const timestamp = Date.now();
          const nonce = 0;
          const data = [];
          const difficulty = lastBlock.difficulty - 3;
          const hash = cryptoHash(timestamp, lastHash, nonce, difficulty, data);

          const badBlock = new Block ({
            timestamp, lastHash, nonce, difficulty, data, hash
          });

          blockchain.chain.push(badBlock);

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
          
        })
      });


    });
  });

  describe('replaceChain()', () => {


    let errorMock, logMock;

    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();

      global.console.error = errorMock;
      global.console.log = logMock;
    })

    describe('when new chain is not longer', () => {
      it('does not replace the chain', () => {
        newChain[0] = {new: 'chain'};
        blockchain.replaceChain(newChain.chain);
        expect(blockchain.chain).toEqual(originalChain);
      })
    })

    describe('when new chain is longer', () => {

      beforeEach(() =>{
        newChain.addBlock({data: 'one'});
        newChain.addBlock({data: 'two'});
        newChain.addBlock({data: 'three'});
      });

      describe('and the chain is invalid', () => {
        it('does not replace the chain', () => {
          newChain.chain[2].hash = 'fake-hash';
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(originalChain);
        })

        it('logs an error', () => {
          newChain.chain[2].hash = 'fake-hash';
          blockchain.replaceChain(newChain.chain);
          expect(errorMock).toHaveBeenCalled();
        })
      })

      describe('and the chain is valid', () => {
        it('does replace the chain', () => {
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(newChain.chain);
        })
      })
    })
  })
});