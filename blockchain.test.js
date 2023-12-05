const Block = require('./block');
const Blockchain = require('./blockchain');

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


    });
  });

  describe('replaceChain()', () => {
    describe('when new chain is not longer', () => {
      it('does not replace the chain', () => {
        newChain[0] = {new: 'chain'};
        blockchain.replaceChain(newChain.chain);
        expect(blockchain.chain).toEqual(originalChain);
      })
    })

    describe('when new chain is longer', () => {

      beforeEach(() =>{
        blockchain.addBlock({data: 'one'});
        blockchain.addBlock({data: 'two'});
        blockchain.addBlock({data: 'three'});
      });

      describe('and the chain is invalid', () => {
        it('does not replace the chain', () => {
          newChain.chain[2].hash = 'fake-hash';
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(originalChain);
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