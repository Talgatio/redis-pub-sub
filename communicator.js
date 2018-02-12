const redis = require("redis");
const pub = redis.createClient();
const sub = redis.createClient();
const cacheManager = require('cache-manager');
var redisStore = require('cache-manager-redis');
let time = require('./time');

var redisCache = cacheManager.caching({
    store: redisStore,
    host: 'localhost', // default value
    port: 6379, // default value
    db: 0,
    ttl: 600
});

let lable;
let ids = [
    {
        id: '5a256e1221049d143cd6b385',
        x: 1.64578,
        y: 2.45644,
        z: 1.34342,
        timeStamp: Date.now()
    },
    {
        id: '5a267482c391351848168fd7',
        x: 2.34242,
        y: 1.32523,
        z: 2.32522,
        timeStamp: Date.now()
    },
    {
        id: '5a2678b4c391351848168fd9',
        x: 4.34252,
        y: 3.34345,
        z: 2.85476,
        timeStamp: Date.now()
    },
    {
        id: '5a26a0528b73481c7c932cec',
        x: 3.85245,
        y: 5.22142,
        z: 4.35345,
        timeStamp: Date.now()
    },
    {
        id: '5a26a9c060765c1c38da8ec2',
        x: 2.65446,
        y: 4.34545,
        z: 2.34525,
        timeStamp: Date.now()
    }
];
let count = 0;
let setRadomPosition = setInterval(() => {

    ids.forEach((item, i) => {
        //Upward movement
        if (i % 2 === 0) {
            item.x = (item.x +0.005);
            item.y = (item.y + 0.005);
            item.z = (item.z - 0.005);
            item.timeStamp = Date.now();
        } else {
            //Move Down
            item.x = (item.x - 0.005);
            item.y = (item.y - 0.005);
            item.z = (item.z + 0.005);
            item.timeStamp = Date.now();
        }


        console.time(item.id);
        pub.publish('communicator', JSON.stringify(item));


    });

}, 2000);

sub.on('message', (ch, message) => {
    console.log('==============');
    console.timeEnd(JSON.parse(message).id);
    console.log(message);
    console.log('==============');

})

sub.subscribe("automation");
