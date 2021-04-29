var express = require("express");
var fs = require("fs");
const https = require('https')
var cors = require('cors')
var bodyParser = require("body-parser");
var app = express();

let cache = {}

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    console.log("/")
    res.status(200).send("hello world");
});
/*
app.get("/:key", function(req, res) {
    let key = req.params.key
    console.log("/",key)
    res.status(200).send(cache[key]);
});
*/

app.post('/', function(request, response){
    console.log("POOOOST!!!!",request.body);      // your JSON
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    console.log("IP",ip)
    response.send(" ⏳ Sending you ETH... it could take some time...");    // echo the result back
    const key = ip
    console.log("key:",key)
    if(!cache[key]){
      cache[key] = Date.now()
      console.log("NEW")
    }else{
      let timePassed = Date.now() - cache[key]
      console.log("timePassed:",timePassed)
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
