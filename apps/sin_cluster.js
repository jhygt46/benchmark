var app = require('http').createServer(serverfunc);
app.listen(80, () => { console.log("RUNNING 81") });

const mongodb = require('mongodb');

var db;
const connectionString = 'mongodb://localhost:27017/allin';
mongodb.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) { db = client.db() });


function serverfunc(req, res){
    res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST', 'Content-Type': 'application/json' });
    var url = req.url.split("/");
    if(req.method === 'GET'){
        if(url[1] == ""){
            var times = 10000000;
            while(times > 0){
                --times;
            }
            res.end("");
        }
    }
    if(req.method === 'POST'){
        if(url[1] == ""){
           var body = '';
           req.on('data', function (data) { 
                body += data 
           });
           req.on('end', function () {
                res.end("");
           }); 
        }
    }
}