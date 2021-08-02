import express from "express";

const app = express();

app.use(express.json());

var bridge = require('../bridge.js');
var viper = require('../viper.js');
var cors=require('cors');

app.use(cors({origin:true,credentials: true}));

app.get('/',(req, res) => {
    res.send('Hello World!');
});
app.post('/lp/pair',(req, res) => {
});
app.post('/lp/explore',(req, res) => {
  res.send('Hello Explore!');
});
app.post('/lp/addLiquidity',(req, res) => {
  const oneAddress = req.body.oneAddress 
  const ethAddress = req.body.ethAddress
  const amount = req.body.amount
  const hash = req.body.hash
  bridge.OperationCall(oneAddress,ethAddress,amount,hash);
});

app.post('/lp/removeLiquidity',(req, res) => {
  res.send('Hello removeLiquidity!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on PORT ${port}`));
