const mongoose = require('mongoose');

// mongoose.set('strictQuery',true);


const connectDB = (url) => {

    mongoose.connect(url,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log(`DB Connection successful`);
    }).catch((err) => {
        console.log(`DB not connected`);
        console.log(err);
    });
}

module.exports = connectDB;

