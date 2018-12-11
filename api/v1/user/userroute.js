const express = require('express');

const router = express.Router();

const passport = require('passport');

router.post('/', (req, res) => {

  const newUser = {

    email: req.body.email,
    password: req.body.password

  }

  new User(newUser)
  .save()

})

router.get('/verify', (req, res) => {

	if(req.user) {

		console.log(req.user)

	} else {

		console.log('not user');

	}

});

router.get('/logout', (req, res) => {

	req.logout();

	res.redirect('/');

});

//export Router
module.exports = router;
