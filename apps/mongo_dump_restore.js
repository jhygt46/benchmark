var app = require('http').createServer(serverfunc);
app.listen(80, () => { console.log("RUNNING 81") });

var { exec } = require('child_process');
const mongodb = require('mongodb');
const fs = require('fs');

var mongoTools = require("node-mongotools");


var db;
const connectionString = 'mongodb://myTester:buenanelson@34.121.247.48:27017/test';
mongodb.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) { db = client.db() });

function mongodump(){
    var file = '/var/node/benchmark/resp.gz';
    var backupDB = exec('mongodump --host=34.121.247.48 --port=27017 --username=myTester --password=buenanelson --db=test --collection=hola --archive='+file+'  --gzip');
    backupDB.stdout.on('data',function(data){
        console.log('stdout: ' + data);
    });
    backupDB.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    backupDB.on('exit', function (code) {
        console.log('mongodump exited with code ' + code);
        mongorestore(file);
    });
}
function mongorestore(ruta){
    mongoTools.mongorestore({ 
        dumpPath: ruta,
        uri: 'mongodb://localhost:27017'
    })
    .then((success) => {
        console.info("success", success.message);
        if(success.stderr){
            console.info("stderr:\n", success.stderr);
        }
        fs.unlinkSync(ruta);
    })
    .catch((err) => console.error("error", err) );
}
mongodump();



async function serverfunc(req, res){
    res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST', 'Content-Type': 'application/json' });
    var url = req.url.split("/");
    if(req.method === 'GET'){
        if(url[1] == ""){
            console.log(await db.collection("hola").find({}));
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