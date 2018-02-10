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

        let memoryUsage = process.memoryUsage();

        if (prev.y > 0) {
            if (prev.y < msg.y) {
                pub.publish('automation', `${JSON.stringify(msg.id)} with ind: ${ind} Move Up, memory: ${memoryUsage.heapUsed} kbs`)
            } else {
                pub.publish('automation', `${JSON.stringify(msg.id)} with ind: ${ind} Move Down, memory: ${memoryUsage.heapUsed} kbs`)
            }
        } else {
            if (prev.y > msg.y) {
                pub.publish('automation', `${JSON.stringify(msg.id)} with ind: ${ind} Move Up, memory: ${memoryUsage.heapUsed} kbs`)
            } else {
                pub.publish('automation', `${JSON.stringify(msg.id)} with ind: ${ind} Move Down, memory: ${memoryUsage.heapUsed} kbs`)
            }
        }
        previousData[ind] = msg;
    }

});

sub.subscribe("communicator");