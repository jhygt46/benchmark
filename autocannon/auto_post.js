 'use strict'
 
const autocannon = require('autocannon');

async function init(){
    const instance = autocannon({
        url: 'http://localhost:80',
        connections: 10,
        duration: 5,
        method: 'POST',
        pipelining: 4,
        body: 'hola=mundo'
    });

    autocannon.track(instance, {renderProgressBar: true});
}

init();