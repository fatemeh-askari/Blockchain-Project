const express = require ('express');
const Blockchain = require('./blockchain');
const Pubsub = require('./pubsub');
const tcpPortUsed = require('tcp-port-used')

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

let PORT = 3000;

tcpPortUsed.check(3000, '127.0.0.1')
.then(function(inUse){
  if(inUse){
    PORT += Math.ceil(Math.random() * 1000);
  }
  app.listen(PORT, () => {
    console.log(`listening at hocalhost:${PORT}`)
  });
})

// app.listen(PORT, () => {
//   console.log(`listening at hocalhost:${PORT}`)
// });