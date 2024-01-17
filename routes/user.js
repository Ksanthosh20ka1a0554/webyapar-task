const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/login', (req, res) => {
  res.render('user-login'); 
});

router.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
    
    const user = await User.findOne({ userId: userId });

    if (user && user.password === password) {
      req.session.userLoggedIn = true; 
      req.session.userId = userId; 
      res.redirect('/user/update-details');
    } else {
      res.render('user-login', { error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});



router.get('/update-details', async (req, res) => {
  try {
   
    if (!req.session.userLoggedIn) {
      return res.redirect('/user/login');
    }

    
    const user = await User.findOne({ userId: req.session.userId });
    res.render('update-details', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/update-details', async (req, res) => {
    try {
        
        if (!req.session.userLoggedIn) {
            return res.redirect('/user/login');
        }

        
        const user = await User.findOne({ userId: req.session.userId });

        
        user.name = req.body.name;
        
        if (req.body.croppedImage) {
            const imageData = req.body.croppedImage.replace(/^data:image\/jpeg;base64,/, '');
            const imageBuffer = Buffer.from(imageData, 'base64');
            user.profileImage = imageBuffer;
          }
        await user.save();

        res.redirect('/user/update-details');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;