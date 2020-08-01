require('dotenv').config({path:'.env'});
import * as express from 'express';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';
import * as path from 'path';
import * as mongoose from 'mongoose';

const app = express();

// const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useCreateIndex: true,   
    useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', (err) => console.error(err))
db.on('open', () => console.log('connect Database'))

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }))

// parse application/json
// app.use(bodyparser.json())
app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));

// Allow Origin
app.use(cors());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

// Import file
const login = require('./route/login');
const category = require('./route/category');
const subCategory = require('./route/subCategory');
const slider = require('./route/slider');
const type = require('./route/type');
const features = require('./route/features');
const subscribeData = require('./route/subscribeData');
const rating = require('./route/rating');
const review = require('./route/review');
// import category from './route/category';
import { verifytoken } from './common/verifytoken';
// Routing
app.use('', (req, res) => {
    res.json({
        data: 'Welcome to nodeapp'
    });
});
app.use('/login', login);
app.use('/category', category);
app.use('/subCategory', subCategory);
app.use('/slider', slider);
app.use('/type', type);
app.use('/features', features);
app.use('/subscribe', subscribeData);
app.use('/rating', rating);
app.use('/review', review);
app.use('/upload/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, "./upload/" + req.params.filename));
});




app.listen(process.env.PORT || 80, () => {
    console.log('Start application', process.env.PORT)
});
