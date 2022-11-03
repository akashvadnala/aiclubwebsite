const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Cookie Parser
app.use(cookieParser());

// Body parser
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config({ path:'./config.env' });
require('./db/conn');
app.use(require('./router/auth'));

app.get('/',(req,res) => {
    res.send(`Hello from server..`);
});

const PORT = process.env.PORT;


app.listen(PORT,()=>{
    console.log(`Server is running at port no ${PORT}`);
});