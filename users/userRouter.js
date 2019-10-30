const express = require('express');
const userDb = require('./userDb');
const postDb = require('../posts/postDb');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  userDb.insert(req.body)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(err => {
    res.status(500).json({error: 'There was an error adding the user to the database'})
  })
});


router.post('/:id/posts',validateUserId,validatePost, (req, res) => {
  console.log(req.body,req.post)
  if(req.body){
    postDb.insert(req.body)
    .then(post => {
      res.status(201).json(post)
    })
    .catch(err => {
      res.status(500).json({error: "there was an error posting to the database"})
    })
  }
});

router.get('/', (req, res) => {
  userDb.get(req.query)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    res.status(500).json({error: "the user could not be retrieved"})
  })
});

router.get('/:id',validateUserId, (req, res) => {
  userDb.getById(req.params.id)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    res.status(500).json({error: "the user could not be retrieved"})
  })
});

router.get('/:id/posts',validateUserId,validatePost, (req, res) => {
  userDb.getUserPosts(req.params.id)
  .then(post => {
    res.status(201).json(post);
  })
  .catch(err => {
    res.status(500).json({error: "the users posts could not be retrieved"})
  })
});

router.delete('/:id',validateUserId, (req, res) => {
  userDb.remove(req.params.id)
  .then(rem => {
    if(rem > 0){
      res.status(200).json({message: "The User has been deleted!"})
    }else{
      res.status(404).json({message: "The user was not found"})
    }
  })
});

router.put('/:id',validateUser,validateUserId, (req, res) => {
  const changes = req.body;
  userDb.update(req.params.id, changes)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(err => {
    res.status(500).json({error: "There was an error while trying to update the user"})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const {id} = req.params;
  if(Number(id)){
    next();
}else {
  res.status(400).json({message: 'Invalid User id'})
}
};

function validateUser(req, res, next) {
  if(!req.body){
    res.status(400).json({message: 'missing user data'})
  }else if(!req.body.name){
    res.status(400).json({message: 'missing required name field'})
  }else{
    next();
  }
};

function validatePost(req, res, next) {
  console.log(req.body)
if(req.body) {
  next();
}else if (!req.body.text){
  res.status(400).json({error: "missing required text field"})
}else {
  res.status(400).json({error: "missing post data"})
}
};

module.exports = router;
