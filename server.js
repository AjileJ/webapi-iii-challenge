const express = require('express');
const helmet = require('helmet')
const server = express();
const router = require('./users/userRouter');

function logger(prefix){
  return(req,res,next) => {
    console.log(`${prefix} [${new Date().toISOString()}] ${req.method} to ${req.url}`);
    next();
  };
}




function gateKeeper(req, res, next) {
  const password = req.headers.password || '';
  if( password.toLowerCase() === '') {
    res.status(400).json({
      error: "please provide a password"
    })
  } else if(password.toLowerCase() === 'mellon'){
    next();
  } else {
    res.status(401).json({
      you: "cannot pass!!"
    })
  }
 }

server.use(helmet());
server.use(express.json());
server.use(gateKeeper);
server.use('/api/posts/user' , logger('Logger for posts: '), router);
server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware




module.exports = server;
