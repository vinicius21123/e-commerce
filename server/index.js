const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const localStrategy = require ('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
require("dotenv").config()
require('./googleAuth');
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({
    origin: ["http://localhost:3000",'http://localhost:3001','https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&scope=email%20profile&client_id=535231434963-cdl3fbmhu5v7olaf60g622qg7k2qlgsh.apps.googleusercontent.com'],
    credentials:true
})); 

app.use(session({ 
    secret:'secretcode', 
    resave:false,
    saveUninitialized:false,
    cookie: { maxAge: 10000 * 5 } 
})); 

app.use(cookieParser('secretcode'));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  });

//GAMES TABLE 
app.get('/products',async(req,res)=>{
    try{
        const allProducts = await pool.query('SELECT * FROM product ORDER BY 2;');
        
        res.json(allProducts.rows);
    }catch(err){
        console.error(err.message);
    }
})

//CART TABLE
app.get('/cart/:id',async (req,res)=>{
    try{
        
        const {id} = req.params;
        const anApp = await pool.query('SELECT * FROM cart_item,product WHERE cart_item.cart_id=$1 AND product.product_id = cart_item.product_id ORDER BY 2;',[id]);
        res.json(anApp.rows);
    }catch(err){
        console.error(err.message);
    }
})


app.post('/cart',async(req,res)=>{ 
    try{
       
        const {product_id,cart_id,quantity} = req.body;
        const newApp = await pool.query('INSERT INTO cart_item(product_id,cart_id,quantity) VALUES($1,$2,$3) RETURNING *;',[product_id,cart_id,quantity]);
        res.json(newApp.rows[0]);
    }catch(err){
        console.error(err.message);
    }
})
app.put('/cart/:id',async(req,res)=>{
    console.log('calleed')
    try{
        const {id} = req.params;
        const {product_id,cart_id,quantity} = req.body;
        const updateApp = await pool.query(`UPDATE cart_item SET quantity =$1 WHERE product_id =$2 AND cart_id=$3;`,[quantity,product_id,cart_id]);
        res.json('Cart updated');
    }catch(err){
        console.error(err.message);
    }
})

app.put('/cart/delete/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const {product_id} = req.body;
        const updateApp = await pool.query(`DELETE FROM cart_item WHERE product_id=$1 AND cart_id =$2;`,[product_id,id]);
        res.json('Cart updated');
    }catch(err){
        console.error(err.message);
    }
})



//USERS TABLE
app.get('/auth/google',(req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    passport.authenticate('google',{scope: ['email','profile']})(req,res,next);
})

app.post('/login',(req,res,next)=>{
     
    passport.authenticate("local",(err,user,info)=>{
        if(err){
            throw err;
        } 
        if(!user)res.send('No user Exists');
        else{
            req.logIn(user,(err)=>{
                
                // if(err)throw err;
                
                res.send(req.user);
            });
        }
        
    })(req,res,next);

})

app.post('/register', async(req,res)=>{
    try{
        console.log(req.body);
        const checkUser = await pool.query("SELECT * FROM users WHERE email_address= $1;",[req.body.email]);
        
        if(checkUser.rows.length !== 0){
            console.log(checkUser.rows[0].password)
           res.send('Theres already a user with that email.')
        }
        else{
            let cartNumber = Math.floor((Math.random() * 10000) + 1);
            let checkCart = await pool.query('select * from cart where cart_id = $1;',[cartNumber]);
            console.log(`first time the number is ${cartNumber}`)
            while(checkCart.rows.length !== 0){
                console.log(`in the loop, number = ${cartNumber}`)
                cartNumber = Math.floor((Math.random() * 10000) + 1);
                checkCart = await pool.query('select * from cart where cart_id = $1;',[cartNumber]);
            }
            if(checkCart.rows.length === 0){
                const cartCreate = await pool.query('insert into cart values($1)',[cartNumber])
                const hashedPassword = await bcrypt.hash(req.body.password,10);
                const newApp = await pool.query("insert into users (email_address,password,cart_id) VALUES($1,$2,$3);",[req.body.email,hashedPassword,cartNumber]);
                res.send('User created')

            }
           
            console.log('dunno what happend')
            // res.redirect('http://localhost:3001/');
            // res.json(newApp.rows[0]);
        }
       
        

    }catch(err){
        console.error(err.message); 
    }
})
app.delete('/logOut', async(req,res)=>{
    try{
        
        res.cookie('secretcode',{ minAge: 100 });
        res.clearCookie()
        console.log(res.cookie)
        req.logout(()=>{
            console.log('logged out');
            req.session.destroy(function (err) {
                if (!err) {
                    res.clearCookie('connect.sid', {path: '/'}).json({status: "Success"});
                    req.user = undefined;
                    console.log(req.user)
                } else {
                    // handle error case...
                    console.log(err.message)
                }
        
            });
            
        });
        
  
    
    }catch(err){
        console.error(err.message);
    }
})
app.get('/getUser', async(req,res)=>{
    console.log('getting user');

    try{
        console.log(req.user)
        res.send(req.user);

    }catch(err){
        console.error(err.message);
    }
})


app.post("/create-checkout-session", async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.items.map(item => {
          
          return {
            price_data: {
              currency: "gbp",
              product_data: {
                name: item.title,
              },
              unit_amount: item.price * 100,
            },
            quantity: item.quantity,
          }
        }),
        success_url: `http://localhost:3000`,
        cancel_url: `http://localhost:3000`,
      })
      res.json({ url: session.url })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })
  


app.listen(3001,()=>{
    console.log('Server has started on port 3001');
})

