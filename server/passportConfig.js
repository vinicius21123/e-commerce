const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;
const pool = require('./db');

module.exports = function (passport) {
    console.log('in passport')
    passport.use(
        new localStrategy({usernameField:"email",passwordField:"password"},(email,password,done)=>{
            console.log('in passport')
            pool.query("SELECT * FROM users WHERE email_address= $1;",[email],(err,user)=>{
                
                if(err){
                    done(null,false);
                }
                 
                if(!user) return done(null,false);
                console.log(user.rows)
            if(user.rows.length === 0){
                console.log('haha')
                done(null,false);
            }
            else{
                bcrypt.compare(password,user.rows[0].password,(erro,result)=>{

                    if(result === true){
                        
                        console.log(user.rows[0])
                        return done(null,user.rows[0])
                    } 
                    else{
                        return done(null,false);
                    }
                })
            }
        })
            
    }));

    passport.serializeUser((user,cb)=>{
        console.log('got called login')

        cb(null,user.user_id);
    })
    passport.deserializeUser((id,cb)=>{
        console.log('got called')
        const query =  pool.query("SELECT * FROM users WHERE user_id= $1;",[id],(err,user)=>{
            cb(null,user.rows[0]);
        });
       
    })



}   