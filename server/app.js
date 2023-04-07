const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
dotenv.config({ path:'./config.env' });
const Config = require('./Config');

// require('./db/conn');
const connectDB = require('./db/conn');

app.set("trust proxy",1);
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
// console.log('client url: ',Config.CLIENT_URL.split(','));
app.use(cors({ 
    credentials: true, 
    origin: Config.CLIENT_URL.split(','),
    exposedHeaders: ['set-cookie'] 
}));
// app.use(cors({ credentials: true, origin: "*" }));
app.use('/api/v1/uploads',express.static(path.resolve('uploads')));
app.use('/api/v1/EvaluationFiles',express.static(path.resolve('EvaluationFiles')));
// console.log('dir',path.resolve('uploads'));

//routes
app.use("/api/v1/",require('./router/auth'));
app.use("/api/v1/",require('./router/team'));
app.use("/api/v1/",require('./router/inductions'));
app.use('/api/v1/blogs',require('./router/blogs'));
app.use("/api/v1/",require('./router/leaderboard'));
app.use("/api/v1/",require('./router/projects'));
app.use("/api/v1/",require('./router/about'));
app.use("/api/v1/",require('./router/evaluations'));
app.use('/api/v1/events',require('./router/events'));
app.use('/api/v1/gallery',require('./router/gallery'));
app.use("/api/v1/",require('./router/subscribe'));
app.use("/api/v1/",require('./router/slider'));


const PORT = Config.PORT;

const url = Config.DATABASE;

//dummy api for testing
app.get('/api/v1/test',(req,res)=>{
    res.status(500).send('testing')
})

const start = async () => {
    try{
        connectDB(url);
        app.listen(PORT,()=>{
            console.log(`Server is running at port no ${PORT}`);
        });
    }catch(error){
        console.log(error);
    }
}

start();