const express = require('express'); //Import the express dependency
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const helmet = require('helmet');


const app = express();              //Instantiate an express app, the main work horse of this server
const port = 3000;                  //Save the port number where your server will be listening





app.use(express.json());
app.use(mongoSanitize());
app.use(cors());

app.use(helmet({
    crossOriginResourcePolicy: false,
  }));

app.use('/users', require('./routes/users'));

//Idiomatic expression in express to route and respond to a client request//
app.get('/test', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile('index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});







app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});