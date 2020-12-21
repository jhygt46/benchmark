var app = require('http').createServer(serverfunc);
app.listen(80, () => { console.log("RUNNING 81") });

var spawn = require('child_process').spawn;
const mongodb = require('mongodb');
const restore = require('mongodb-restore-dump');
var uri = 'mongodb://localhost:27017';

var mongoTools = require("node-mongotools");



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
      mongorestore();
    });
}
async function mongorestore(){
    console.log(await restore.database({
        uri,
        database: 'test',
        from: '/var/node/mongodump-2011-10-24'
    }));
}

setTimeout(()=>{

    mongoTools.mongodump({ 
        db: 'test',
        path: '/var/node/mongodump-2011-10-25',
        host: '34.121.247.48',
        port: '27017',
        userName: 'myTester', 
        password: 'buenanelson', 
        authenticationDatabase: 'admin'
    })
    .then((success) => console.info("success", success) )
    .catch((err) => console.error("error", err) );
    /*
    mongoTools.mongorestore({ 
        dumpPath:'/var/node/mongodump-2011-10-25',
        uri: 'mongodb://localhost:27017'
    })
    .then((success) => {
       console.info("success", success.message);
       if (success.stderr) {
         console.info("stderr:\n", success.stderr);// mongorestore binary write details on stderr
       }
    })
    .catch((err) => console.error("error", err) );
    */
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