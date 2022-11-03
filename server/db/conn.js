const mongoose = require('mongoose');

const DB = process.env.DATABASE;

// const DB='mongodb://127.0.0.1:27017/';

mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`DB Connection successful`);
}).catch((err) => {
    console.log(`DB not connected`);
    console.log(err);
});