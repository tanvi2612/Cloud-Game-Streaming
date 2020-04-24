if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

  const stripeSecretKey = 'sk_test_3CpOceoR8utO6DGaqpR8bWUV00JM9hHMF3'
  const stripePublicKey = 'pk_test_9hE3TqonmPnmg5jExEY40g1X003FgmI9lB'

  const path = require('path')
  const express = require('express')
  const app = express()
  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  const mongoose = require('mongoose')
  const LocalStratergy = require('passport-local').Strategy;
  const cmd = require('node-cmd');
  const stripe = require('stripe')(stripeSecretKey)
  var uname, user_name;
  // const initializePassport = require('./passport-config')
  // initializePassport(
  //   passport,
  //   email => User.findOne(user => user.email === email),
  //   id => User.findOne(user => user.id === id)
  // )
  passport.serializeUser((user,done)=>{
    done(null,user.id)
  })
  passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
      done(err,user);
    });
  })
  passport.use(
    new LocalStratergy({usernameField:"email"},(email,password,done)=>{
      User.findOne({email:email})
          .then(user=>{
            bcrypt.compare(passport,user.password,(err,isMatch)=>{
              if(err) throw err;

              if(isMatch){
                return done(null,user);
              }
              else{
                return done(null,false,{message:"Wrong Password"});
              }
            })
          })
          .catch(err=>{
            return done(null,flash,{message:err});
          })
    })
  )

  // Connection to mongodb
  mongoose.connect('mongodb://127.0.0.1:27017/users', { useNewUrlParser: true,useUnifiedTopology: true });
  const connection = mongoose.connection;
  connection.once('open', function() {
      console.log("MongoDB database connection established succesfully.");
  })
  
  const users = []
  let Game = require('./models/game');
  let User = require('./models/user');
  
  app.set('view-engine', 'ejs')
  app.use(express.static(path.join(__dirname, 'public')))
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  app.use(session({
    secret: "7fdca2c7ecdc07c00c6edd4566ffee57",
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  
  app.get('/', checkAuthenticated, (req, res) => {
    Game.find(function(err, games) {
      if (err) {
          console.log(err);
      } else {
          res.render('index.ejs', {games : data})
      }
    });
  })
  
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })
  
  // app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  //   // successRedirect: '/',
  //   // failureRedirect: '/login',
  //   // failureFlash: true
  // }))
  
  app.post('/login', checkNotAuthenticated, async (req, res) => {
    try {
      User.find({
        email: req.body.email,
    }, (err, users) => {
          if(err) {
              console.log('server error')
              res.redirect('/login')
              return ;
          }
          if(users.length < 1) {
              console.log('No such user found')
              res.redirect('/login')
              return ;
          }
          // console.log(users[0].password, req.body.password)
          bcrypt.compare(req.body.password, users[0].password, (err, match) =>{
            if(err){
                console.log(err)
                res.redirect('/login')
                return ;
            }
            else if(!match){
              console.log('Password doesnt match!')
                res.redirect('/login')
                return ;
            }
            else{
                console.log('Confirmed')
                uname = req.body.email;
                res.redirect('/dashboard')
                return ;
              }
          })
        })
    }
    catch {
      console.log('error');
      res.redirect('/register')
    }
  })


  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  })
  
  app.post('/register', checkNotAuthenticated, (req, res) => {
    try {

      User.find({
        email: req.body.email
    }, async (err, users) => {
          if(err) {
                  res.redirect('/register')
              return ;
          }
          if(users.length > 0) {
                  console.log('User already registered')
                  res.redirect('/register')
              return ;
          }
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          let temp = req.body;
          temp['password'] = hashedPassword;
          // console.log(temp);
          let user = new User(temp);
          // console.log(user);
          user.save()
              .then(user=>{
                res.status(200).json({'user':'User is registered successfully'})
              })
              .catch(err=>{
                res.status(400).send('Error');
              })
          res.redirect('/login')
      })
    } catch {
      console.log('error');
      res.redirect('/register')
    }
  })
  
  app.get('/dashboard', checkNotAuthenticated, async (req, res) => {
    // console.log(uname)
    // if(uname == null)
      // res.redirect('/login')

    await User.findOne({email : uname}, (err, foundusers) => {
      if(err)
      {
        console.log(err)
        return ;
      }
    else if(foundusers==null)
    {
      res.redirect('/login')
      // return ;
    }
    else{
       user_name =  foundusers.name
   }
  }) 

    // console.log(user_name)
    Game.find({ user: uname},function(err, games) {
      if (err) {
          console.log(err);
      } else {
              // console.log(user_name)
              res.render('index.ejs', {games, user_name})
          }
    });
  })

  app.get('/all',(req, res) => {
    Game.find({ user: { $nin : uname } }, function(err, games) {
      if (err) {
          console.log(err);
      } else {
          // console.log(uname)
          res.render('allgames.ejs', {games})
      }
    });
  })
  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })


  app.get('/settings', checkNotAuthenticated, (req, res) => {
    res.render('settings.ejs')
  })


  app.post('/settings', checkNotAuthenticated, async (req, res) => {
    var message;
    if ( req.body.npassword != req.body.cpassword ){
      message = "New Passwords do not match! "
      console.log(message)
      res.render('settings.ejs', {message});
      return ;
    }
    await User.findOne({email : uname},async (err, foundusers) => {
      if(err)
      {
        console.log(err)
        return ;
      }
      else if(foundusers==null)
      {
        console.log('No such users found')
        // res.redirect('/settings')
        return ;
      }
      else{
        user_pass =  foundusers.password

    await bcrypt.compare(req.body.opassword, user_pass, async (err, match) =>{
        
        if(err){
            console.log(err)
            message = "error occured"
            // res.render('/settings', {message})
            return ;
        }
        else if(!match){
            message = "Old password does not match!"
            console.log('old password doesnt match')
            // res.render('/settings', {message})
            return ;
        }
        else{
            const hashedPassword = await bcrypt.hash(req.body.npassword, 10);
            var newvalues = { $set: {password: hashedPassword} };
            User.updateOne({
               email : uname}
            , newvalues , (err,newusers) => {
                    if(err) {
                        console.log(err)
                        message = "Some error occured, password change unsuccessful!"
                        return ;
                    }
                    else {
                        console.log('Password Change Successfully!')
                        message = "Password Change Successfully!"
                        return ;     
                    }
                }
            )
          }
      })
      } 
    })
    res.redirect('/settings')
  })

  app.get('/playgame',checkNotAuthenticated,(req,res)=>{
      cmd.get('cd C:\\"Program Files"\\TightVNC && tvnviewer.exe -host=192.168.43.82',function(err,data,stderr){
          if(!err){
            console.log(data);  
		  }
          else{
            console.log(err);  
		  } 
      });
  })

  app.get('/purchase', checkNotAuthenticated, async (req, res) => {
    const stripe = require('stripe')('sk_test_3CpOceoR8utO6DGaqpR8bWUV00JM9hHMF3');
    console.log("abouttoreturnenter")
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        name: req.originalUrl.slice(14),
        description: 'Cloud gaming service; purchase a game',
        amount: 100,
        currency: 'inr',
        quantity: 1,
      }],
      success_url: 'http://localhost:3000/paysuccess?_'+req.originalUrl.slice(14),
      cancel_url: 'http://localhost:3000/dashboard',
});
  console.log("abouttoreturn")
  console.log({session:session})
  res.send({session:session})
  })

  app.get('/paysuccess', checkNotAuthenticated, async (req, res) => {
    console.log("game is ",req.originalUrl.slice(13))
    var gamename=req.originalUrl.slice(13)
    console.log(gamename);
    console.log("gonna change paysuccess")
    await User.findOne({email : uname}, (err, foundusers) => {
      if(err)
      {
        console.log(err)
        return ;
      }
    else if(foundusers==null)
    {
      res.redirect('/login')
      // return ;
    }
    else{
      uemail =  foundusers.email
      console.log("email is",uemail)

       var newvalues =  { $push: { user: uemail } } ;
          Game.updateOne( 
            {username: gamename},
            newvalues , (err,newusers) => {
                  if(err) {
                      console.log(err)
                      message = "Some error occured, status change unsuccessful!"
                      return ;
                  }
                  else {
                      console.log('email is status Change Successfully!',uemail)
                      message = "status Change Successfully!"
                      Game.find({ user: uname},function(err, games) {

                        // console.log(user_name)
                        res.render('paysuccess.ejs', {games, user_name})
                      });
                      return ;     
                  }
              }
          )
   }
  }) 
})

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  
  app.listen(3000)

