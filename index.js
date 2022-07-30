const express = require('express')
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');
const winston = require('winston');
const { json } = require('express');

const app = express()
const port = 3000

app.use(cors());
app.use(express.json());



let verifyArray = [];

const sendMessagePromise = (intervel, endTime, chats, user) => new Promise(async (resolve, reject) => {
    var x = 1;
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.File({ filename: `logs/user-${chats[user].id}/chats.log` }),
        ],
    });
    setTimeout(function foo() {
        if (x !== 0) {
            const randomChat = Math.floor(Math.random() * chats.length);
            logger.info({
                "message": uuidv4(),
                "user": chats[user],
                "to": chats[randomChat],
                "timeStamp": new Date()
            });
            verifyArray.push({
                "message": uuidv4(),
                "user": chats[user],
                "to": chats[randomChat],
                "timeStamp": new Date()
            })
            console.log(uuidv4());
            setTimeout(foo, intervel);
        } else {
            return resolve("Job finished");
        }
    }, intervel);

    setTimeout(function () {
        x = 0;
    }, endTime);
})

app.post('/', (req, res) => {
    var { number, intervel, endTime } = req.body;
    let chats = [];
    intervel = parseInt(`${intervel}000`);
    endTime = parseInt(`${endTime}000`);

    for (let i = 0; i < parseInt(number); i++) {
        let final = {
            id: i + 1
        }
        chats.push(final);
    }
    const user = Math.floor(Math.random() * chats.length);
    sendMessagePromise(intervel, endTime, chats, user).then((resp) => {
       res.send(resp)
    })
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})