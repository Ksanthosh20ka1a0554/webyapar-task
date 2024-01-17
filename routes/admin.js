const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin = require('../models/Admin')

router.get('/login', (req, res) => {
  res.render('admin-login');
});

router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  
  try {
    
    const admin = await Admin.findOne({ userId: userId});

    if (admin && admin.password === password) {
      req.session.adminLoggedIn = true; 
      res.redirect('/admin/dashboard');
    } else {
      res.render('admin-login', { error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/dashboard', async (req, res) => {
  try {
    
    if (!req.session.adminLoggedIn) {
      return res.redirect('/admin/login');
    }

    
    const users = await User.find();
    res.render('admin', { users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/create-user', async (req, res) => {
  try {
   
    if (!req.session.adminLoggedIn) {
      return res.status(401).send('Unauthorized');
    }

 
    const { userId, password } = req.body;
    const newUser = new User({ userId, password,name:" ",status:"pending",profileImage:""});
    await newUser.save();

    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/view-users', async (req, res) => {
    try {
 
      const users = await User.find();
      res.render('view-users', { users });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.get('/update/:userId', async (req, res) => {
    try {
        
        if (!req.session.adminLoggedIn) {
            return res.redirect('/admin/login');
        }

        
        const user = await User.findOne({ userId: req.params.userId });

        if (user) {
            
            user.status = 'Approved';
            await user.save();
        }

        res.redirect('/admin/view-users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/delete/:userId', async (req, res) => {
    try {
        
        if (!req.session.adminLoggedIn) {
            return res.redirect('/admin/login');
        }

        
        await User.deleteOne({ userId: req.params.userId });

        res.redirect('/admin/view-users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;
