const INITIAL_DIFFICLTY = 3;
const MINE_RATE = 1000;

const GENESIS_DATA = {
  timestamp: 1,
  lastHash: '-----',
  hash: 'hash-one',
  difficulty: INITIAL_DIFFICLTY,
  nonce: 0,
  data: []
}

module.exports = {GENESIS_DATA, MINE_RATE}; 