const cluster = require('cluster');
const app = require('http');
const numCPUs = require('os').cpus().length;
const port = 80;

if(cluster.isMaster){

    console.log(`Master ${process.pid} is running`);
    for(let i = 0; i < numCPUs; i++){
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });

}else{
    app.createServer(serverfunc).listen(port, ()=>{ console.log("LISTEILOR") });
    console.log(`Worker ${process.pid} started`);
}

function serverfunc(req, res){
    res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST', 'Content-Type': 'application/json' });
    var url = req.url.split("/");
    if(req.method === 'GET'){
        if(url[1] == ""){
            var times = 10000000;
            while(times > 0){
                --times;
            }
        }
        res.end("");
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