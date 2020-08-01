require('dotenv').config({path:'.env'});
import * as express from 'express';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';
// import * as path from 'path';
// import * as mongoose from 'mongoose';

const app = express();

// const mongoose = require('mongoose');
// mongoose.connect(process.env.DATABASE_URL, {
//     useUnifiedTopology: true,
//     useCreateIndex: true,   
//     useNewUrlParser: true
// });
// const db = mongoose.connection;
// db.on('error', (err) => console.error(err))
// db.on('open', () => console.log('connect Database'))

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }))

// parse application/json
// app.use(bodyparser.json())
app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));

// Allow Origin
app.use(cors());

app.use('/', (req, res) => {
    res.json({
        data: 'Welcome to nodeapp'
    })
});

app.listen(process.env.PORT || 80, () => {
    console.log('Start application', process.env.PORT)
});
