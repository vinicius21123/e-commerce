import './login.css';
import { useState } from 'react';
import axios from 'axios';
import { loginSlice } from '../userSlice';
import { useDispatch } from 'react-redux';
const Login = ()=>{
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [register,setRegister] = useState(false);
    const dispatch = useDispatch();
    
    const logIn = ()=>{
        
        if(email.length >0 && password.length > 0){
            axios({
                method:'post',
                data:{
                    email:email,
                    password:password
                },
                withCredentials:true,
                url:"http://localhost:3001/login",
            }).then((res)=>{
                if(res.data !== 'No user Exists'){
                    console.log(res.data)
                    dispatch(loginSlice({data:res.data}));
                    window.location.reload()
                    //setLogout(true);
                    //document.getElementById('loginBar').style.display = 'block'

                }
                else{
                    document.getElementById('problem2').style.display = 'flex';         

                    setTimeout(()=>{
                        document.getElementById('problem2').style.display = 'none';
                    },5000)           
                    console.log(res.data)
                }
    
            });
        }
        else{
            document.getElementById('problem3').style.display = 'flex';
                setTimeout(()=>{
                    document.getElementById('problem3').style.display = 'none';
                },5000)    
        }
    }
    const googleAuth = async ()=>{
            
            let responses = await fetch(`http://localhost:3001/auth/google`,{
                crossorigin: true, 
                withCredentials:true,
            })
            console.log(responses)
        
    }
    const signUp = ()=>{
        
        if(email.length >0 && password.length > 0){
            axios({
                method:'post',
                data:{
                    email:email,
                    password:password
                },
                withCredentials:true,
                url:"http://localhost:3001/register",
            }).then((res)=>{
                if(res.data !== 'User created'){
                    document.getElementById('problem').style.display = 'flex';  
                    setTimeout(()=>{
                        document.getElementById('problem').style.display = 'none';
                    },5000)                   
                }
                else{
                    document.getElementById('registerBar').style.display = 'flex';
                    setTimeout(()=>{
                        document.getElementById('registerBar').style.display = 'none';
                    },5000)     
                }
    
            });
        }
        else{
            document.getElementById('problem3').style.display = 'flex';
                setTimeout(()=>{
                    document.getElementById('problem3').style.display = 'none';
                },5000)    
        }
    }
    return(
        <div>
            <button type="button" data-toggle="modal" data-target="#myModal">Login/Register</button>

            <div id="myModal" className="modal fade" role="dialog">
            <div className="modal-dialog">

                    <div id="formContent" className="modal-content">
                        <div className="modal-header">
                        <div id="registerBar" className="message">
                            <p>You have sucessfully registered!</p>
                            <button id="registerClose" onClick={()=>{
                            document.getElementById('registerBar').style.display = 'none';
                            }} className="messageNotificationClose">&times;</button> 
                        </div>
                        <div id="problem3" className="message">
                            <p>Input fields cannot be empty!</p>
                            <button id="registerClose" onClick={()=>{
                            document.getElementById('problem3').style.display = 'none';
                            }} className="messageNotificationClose">&times;</button> 
                        </div>
                        <div id="problem" className="message">
                            <p>There is already a user with those credentials!</p>
                            <button id="registerClose" onClick={()=>{
                            document.getElementById('problem').style.display = 'none';
                            }} className="messageNotificationClose">&times;</button> 
                        </div>
                        <div id="problem2" className="message">
                            <p>There is no user with those credentials!</p>
                            <button id="registerClose" onClick={()=>{
                            document.getElementById('problem2').style.display = 'none';
                            }} className="messageNotificationClose">&times;</button> 
                        </div>
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        
                        </div>
                        <form>
                            <input type="text" id="email" value={email} required onChange={(e)=>{
                                setEmail(e.target.value)
                            }} placeholder="email"/>
                            <input type="text" id="password" value={password} required onChange={(e)=>{
                                setPassword(e.target.value)
                            }} placeholder="password"/>
                            <button onClick={(e)=>{
                                e.preventDefault()
                                if(register){
                                    signUp()
                                }
                                else{
                                    logIn() 
                                }
                                
                            }}>{register===true?'Register':'Log In'}</button><br/><br/>
                            <button onClick={()=>{
                        googleAuth();
                    }}>Sign in with Google</button>
                        </form>

                <div id="formFooter" className="modal-footer">
                    
                    <button type="button" className="btn btn-default" onClick={()=>{
                        if(register===true){
                            setRegister(false);
                        }
                        else{
                            setRegister(true);

                        }
                    }}>{register===false?'Register':'Log In'}</button>
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                </div>

                </div>
                
                

            </div>
            </div>
            
                    
                
            
        </div>
    )
};

export default Login;

