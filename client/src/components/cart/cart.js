import './cart.css';
import { useState } from 'react';
import React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../userSlice';
function Cart(){
    const [cartData,setCartData] = useState({})
    const [total,setTotal] = useState(0);
    let g = useSelector(selectUser);
    let cartId = g?g.data.cart_id:1;
    if(cartId === undefined){
        cartId = 1;
    }
    const fetchCart = async ()=>{
        const response = await fetch(`http://localhost:3001/cart/${cartId}`);
        let json = await response.json()
        while(json.find(obj=>obj.quantity === 0) !== undefined){
            let body = {product_id:json.find(obj=>obj.quantity === 0).product_id}
            let responses = await fetch(`http://localhost:3001/cart/delete/${cartId}`,{
            method:'PUT',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(body)
            })
            
            window.location.reload();
        }
        
        setCartData(json);
        
    }
    useEffect(()=>{
        let newAmount = 0;
        if(cartData[0]){
            cartData.map(product=>{
                newAmount += product.price * product.quantity;
            })
        }
        setTotal(newAmount)

    },[cartData,setCartData])
    const handleButtons = async (sign,id,amount,cart)=>{
        let quantity = 0;
        if(sign === 0){
            quantity = amount + 1;
            
        }
        else if(sign === 1){
            quantity = amount - 1;
        }
        let body = {product_id:id,cart_id:cart,quantity:quantity}
        let responses = await fetch(`http://localhost:3001/cart/${cart}`,{
            method:'PUT',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(body)
            })
        fetchCart();
    }
    const checkout = async()=>{
        const body = {items:cartData}
        let response = await fetch(`http://localhost:3001/create-checkout-session`,{
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(body)
            }).then(res=>{
                if(res.ok) return res.json()
                return res.json().then(json=>Promise.reject(json))
            }).then(({url})=>{
                window.location = url;
            }).catch(e=>{
                console.error(e.error)
            })
    }
    return(
        <div>

            <button type="button" className="buttonMine" data-toggle="modal" data-target="#myModal2"
            onClick={fetchCart}>CART</button>

            <div id="myModal2" className="modal fade" role="dialog">
            <div className="modal-dialog">

                    <div className="modal-content">
                        <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        
                        </div>
                        <div className='containerCart'>
                            {cartData[0]?cartData.map(product=>{
                            
                                return (
                            <div key={product.product_id}>
                                <img src={product.image} width={150}/>
                                <div className='quantitySection'>
                                    <p>{product.quantity}</p> 
                                    <button onClick={()=>handleButtons(0,product.product_id,product.quantity,product.cart_id)}>+</button>
                                    <button onClick={()=>handleButtons(1,product.product_id,product.quantity,product.cart_id)}>-</button>
                                    </div>
                                
                                <p>{product.title}</p>
                                <p>£{product.price * product.quantity}</p>
                                <button onClick={()=>{
                                    handleButtons(2,product.product_id,product.quantity,product.cart_id)
                                }}>X</button>
                            </div>)}):<h3>No items in your Cart yet!</h3>}
                        </div>
                        

                <div  className="modal-footer total">
                    
                    <h2>Total:{total}</h2>
                    <button onClick={()=>{
                        checkout()
                    }}>Checkout</button>
                </div>

                </div>
                
                

            </div>
            </div>
        </div>
    )
};

export default Cart;