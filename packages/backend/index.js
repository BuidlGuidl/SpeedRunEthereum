var ethers = require("ethers");
var express = require("express");
var fs = require("fs");
const https = require('https')
var cors = require('cors')
var bodyParser = require("body-parser");
var app = express();

let cache = {}
let currentMessage = "I am **ADDRESS** and I would like some Goerli ETH please!"

const INFURA = JSON.parse(fs.readFileSync("./infura.txt").toString().trim())
const PK = fs.readFileSync("./pk.txt").toString().trim()

let wallet = new ethers.Wallet(PK,new ethers.providers.InfuraProvider("goerli",INFURA))
console.log(wallet.address)

const checkWalletBalance = async ()=>{
  console.log("BALANCE:",ethers.utils.formatEther(await wallet.provider.getBalance(wallet.address)))
}
checkWalletBalance()


app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    console.log("/")
    res.status(200).send(currentMessage);
});
/*
app.get("/:key", function(req, res) {
    let key = req.params.key
    console.log("/",key)
    res.status(200).send(cache[key]);
});
*/

app.post('/', async function(request, response){
    console.log("POOOOST!!!!",request.body);      // your JSON
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    console.log("IP",ip)
       // echo the result back
    const key = ip
    console.log("key:",key)
    if(!cache[key] || Date.now() - cache[key] > 60000){
      cache[key] = Date.now()
      console.log("NEW...",request.body.message, request.body.signature)

      if(request.body.message!=currentMessage.replace("**ADDRESS**",request.body.address)){
        response.send(" ⚠️ Secret message mismatch!?! Please reload and try again. Sorry! 😅");
      }else{
        let recovered = ethers.utils.verifyMessage(request.body.message, request.body.signature)
        console.log("recovered",recovered)
        if(recovered==request.body.address){
          console.log("sending...")
          let sendResult = await wallet.sendTransaction({
            to: request.body.address,
            value: ethers.utils.parseEther("0.01")
          })
          console.log("sendResult",sendResult)
          fs.appendFileSync("droppedTo.txt",request.body.address+"\n")
          response.send(" ⏳ Sending you ETH... it could take some time...");
        }
      }

    }else{
      response.send(" ⚠️ Too many requests (probably already ether headed your way) please check back later...");
    }

});


if(fs.existsSync('server.key')&&fs.existsSync('server.cert')){
  https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app).listen(49832, () => {
    console.log('HTTPS Listening: 49832')
  })
}else{
  var server = app.listen(49832, function () {
      console.log("HTTP Listening on port:", server.address().port);
  });
}
