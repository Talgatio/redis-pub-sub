const redis = require("redis");
const pub = redis.createClient();
const sub = redis.createClient();

let previousData = [];
let ids = [];
sub.on('message', (ch, message) => {
    let msg = JSON.parse(message);
    //Unique array of id
    if (ids.indexOf(msg.id) === -1) {
        ids.push(msg.id);
        previousData.push(msg);
    } else {
        let ind = 0;
        let prev = previousData.find((item, i) => {
            if (item.id === msg.id) {
                ind = i;
                return item;
            }
        });

        msg.memoryUsage = process.memoryUsage().heapUsed;

        if (prev.y > 0) {
            if (prev.y < msg.y) {
                msg.way = 'Up';
                pub.publish('automation', JSON.stringify(msg));
            } else {
                msg.way = 'Down';
                pub.publish('automation', JSON.stringify(msg));
            }
        } else {
            if (prev.y > msg.y) {
                msg.way = 'Down';
                pub.publish('automation', JSON.stringify(msg));
            } else {
                msg.way = 'Up';
                pub.publish('automation', JSON.stringify(msg));
            }
        }
        previousData[ind] = msg;
    }

});

sub.subscribe("communicator");