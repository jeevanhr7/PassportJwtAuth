let amqp = require('amqplib/callback_api');
let amqpConn = null;
const User = require('../models/user'),
    mongoose = require('mongoose'),
    _ = require('lodash');

function start() {
    amqp.connect("amqp://dbmtclxu:W8rJh2319mXpun3VO2dYOLzIB717sKL5@cat.rmq.cloudamqp.com/dbmtclxu" + "?heartbeat=60", function (err, conn) {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(start, 1000);
        }
        conn.on("error", function (err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });
        conn.on("close", function () {
            console.error("[AMQP] reconnecting");
            return setTimeout(start, 1000);
        });
        console.log("[AMQP] connected");
        amqpConn = conn;
        whenConnected();
    });
}

function whenConnected() {
    startPublisher();
    startWorker();
}


var pubChannel = null;
var offlinePubQueue = [];
function startPublisher() {
    console.log("Publisher Started");
    amqpConn.createConfirmChannel(function (err, ch) {
        if (closeOnErr(err)) return;
        ch.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function () {
            console.log("[AMQP] channel closed");
        });

        pubChannel = ch;
        while (true) {
            console.log("offline Pub queuq is ", offlinePubQueue);
            var m = offlinePubQueue.shift();
            if (!m) break;
            publish(m[0], m[1], m[2]);
        }
    });
}


function publish(exchange, routingKey, content) {
    try {
        pubChannel.publish(exchange, routingKey, content, {persistent: true},
            function (err, ok) {
                if (err) {
                    console.error("[AMQP] publish", err);
                    offlinePubQueue.push([exchange, routingKey, content]);
                    pubChannel.connection.close();
                }
                else {
                    console.log("Published the Msg to the Queue", content)
                }

            });

    } catch (e) {
        console.error("[AMQP] publish", e.message);
        offlinePubQueue.push([exchange, routingKey, content]);
    }
}


function startWorker() {
    amqpConn.createChannel(function (err, ch) {
        if (closeOnErr(err)) return;
        ch.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function () {
            console.log("[AMQP] channel closed");
        });

        ch.prefetch(1);
        ch.assertQueue("jeevan", {durable: true}, function (err, _ok) {
            if (closeOnErr(err)) return;
            ch.consume("jeevan", processMsg, {noAck: false});
            console.log("Worker is started");
        });
        function processMsg(msg) {
            work(msg, function (ok) {
                try {
                    if (ok) {
                        ch.ack(msg);
                        console.log(" Ack Done")
                    }
                    else
                        ch.reject(msg, true);
                } catch (e) {
                    closeOnErr(e);
                }
            });
        }
    });
}


function work(msg, cb) {
    console.log("Proceessed Messge is", msg.content.toString());

    let data = JSON.parse(msg.content.toString());
    let user = new User(data);
    user.save().then(result=> {
        console.log(result)
    });
    console.log("PDF processing of ", msg.content.toString());
    cb(true);
}


function closeOnErr(err) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    amqpConn.close();
    return true;
}


/*
 setInterval(function () {
 publish("", "jeevan", new Buffer(JSON.stringify({name: "Jeevan"})));
 }, 5000);
 */


exports.push = function (req, res) {
    console.log("Coming body here is", req.body);
    let user = {};
    user.name = req.body.name;
    user.description = req.body.description;
    res.send("Ur Cretion part is on going Process");
    publish("", "jeevan", new Buffer(JSON.stringify(user)));

};
start();