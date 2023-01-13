const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
dotenv.config({ path:'./config.env' });

require('./db/conn');

app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use('/uploads',express.static(path.resolve('uploads')));
console.log('dir',path.resolve('uploads'));

//routes
app.use(require('./router/auth'));
app.use(require('./router/team'));
app.use(require('./router/inductions'));
app.use(require('./router/overview'));
app.use(require('./router/data'));
app.use(require('./router/rules'));
app.use(require('./router/blogs'));
app.use(require('./router/leaderboard'));
app.use(require('./router/projects'));
app.use(require('./router/CTeam'));
app.use('/events',require('./router/events'));




const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{
    console.log(`Server is running at port no ${PORT}`);
});