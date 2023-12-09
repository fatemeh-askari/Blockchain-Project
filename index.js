const express = require ('express');
const Blockchain = require('./blockchain');
const Pubsub = require('./pubsub');
const tcpPortUsed = require('tcp-port-used');
const { default: axios } = require('axios');

const app = express();


const blockchain = new Blockchain();
const pubsub = new Pubsub({blockchain});

// setTimeout(() => {
//   pubsub.broadcastChain();
// }, 1000);

app.use(express.json());

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  const data = req.body.data;
  // const {data} = re.body;

  blockchain.addBlock({data});
  pubsub.broadcastChain();
  res.redirect('/api/blocks');
});

const rootPort = 3000;
let PORT = 3000;

const syncChains = async () => {
  const response = await axios.get(`https:localhost:${rootPort}/api/blocks`);
  blockchain.replaceChain(response.data)
}

tcpPortUsed.check(3000, '127.0.0.1')
.then(function(inUse){
  if(inUse){
    PORT += Math.ceil(Math.random() * 1000);
  }
  app.listen(PORT, () => {
    console.log(`listening at hocalhost:${PORT}`);
    if(PORT !== rootPort) syncChains;
  });
})

// app.listen(PORT, () => {
//   console.log(`listening at hocalhost:${PORT}`)
// });