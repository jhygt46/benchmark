var app = require('http').createServer(serverfunc);
app.listen(80, () => { console.log("RUNNING 81") });

var spawn = require('child_process').spawn;
const mongodb = require('mongodb');

var db;
const connectionString = 'mongodb://myTester:buenanelson@34.121.247.48:27017/test';
mongodb.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) { db = client.db() });

function mongodump(){
    var file = '/var/node/mongodump-2011-10-24';
    var args = ['--host', '34.121.247.48', '--username', 'myTester', '--password', 'buenanelson', '--port', '27017', '--db', 'test', '--collection', 'hola', '--out', file];
    var mongodump = spawn('mongodump', args);
    mongodump.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });
    mongodump.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });
    mongodump.on('exit', function (code) {
      console.log('mongodump exited with code ' + code);
      mongorestore(file);
    });
}
function mongorestore(backup){
    var mongorestore = spawn('mongorestore /var/node/mongodump-2011-10-2');
    mongorestore.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
    mongorestore.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    mongorestore.on('exit', function (code) {
        console.log('mongorestore exited with code ' + code);
    });
}

setTimeout(()=>{
    mongorestore('/var/node/mongodump-2011-10-24');
}, 2000)


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