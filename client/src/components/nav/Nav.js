import './Nav.css';
import Login from '../login/loginForm';
import React, { useEffect } from 'react';
import { useState } from 'react';
import Cart from '../cart/cart';
import { logoutSlice, searchSlice } from '../userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectUser } from '../userSlice';
const Nav = ()=>{
    const [searchTerm,setSearchTerm] = useState('');
    const dispatch = useDispatch();
    let g = useSelector(selectUser);
    let thereIsUser = g?g.data?true:false:false;
    const LogOut = async()=>{
        let response = await fetch(`http://localhost:3001/logOut`,{
            method:'DELETE',
            headers:{"Content-Type":"application/json"}
        })
        
        document.getElementById('loggedOutBar').style.display = 'flex';
        document.getElementById('loginBar').style.display = 'none';
        setTimeout(()=>{
            document.getElementById('loggedOutBar').style.display = 'none';
        },5000) 

        console.log(response)
    }
    useEffect(()=>{
        dispatch(searchSlice({searchTerm:searchTerm}))
    },[searchTerm])
    return(
        <div className='NavDivContainter'>
            <div className='TopNav'>
                <h1>GENERIC TECH COMPANY NAME</h1>
                <input type='text' value={searchTerm} onChange={(e)=>{
                    setSearchTerm(e.target.value)
                }} placeholder='SEARCH...'/>
                {thereIsUser?<button onClick={()=>{
                    dispatch(logoutSlice());
                    LogOut();
                }}>Log Out</button>:<div></div>}
            </div>
            <div className='BottomNav'>
                <ul>
                    <li><a href='/'>HOME</a></li>
                    <li><a href='/'>PRODUCTS</a></li>
                    <li><a href='/'>FAQS</a></li>

                </ul>
            </div>
            {!thereIsUser?<Login/>:<div></div>}
            <Cart/>
        </div>
    )
};

export default Nav;