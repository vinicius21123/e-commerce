import { useEffect } from "react";
import { useState } from "react";
import './products.css';
import { useDispatch, useSelector } from "react-redux";
import { selectSearch, selectUser } from "../userSlice";
import axios from "axios";
import { loginSlice } from "../userSlice";
function Products() {
    const [products,setProducts] = useState({})
    const [products2,setProducts2] = useState({})
    let g = useSelector(selectUser);
    let IdForCart = g?g.data.cart_id:1;
    if(IdForCart === undefined){
        IdForCart = 1;
    }
    if(g){
        if(g.data.hasOwnProperty('cart_id')){
            document.getElementById('loginBar').style.display = 'flex';
            setTimeout(()=>{
                document.getElementById('loginBar').style.display = 'none';
            },5000) 
    
    }
    }
    
    
    

    let s = useSelector(selectSearch);
    
    const dispatch = useDispatch();
    const getProducts = async ()=>{
        try {
            let response = await fetch(`http://localhost:3001/products`);
            let json = await response.json()
            setProducts(json);
            setProducts2(json);
        } catch (err) {
            console.error(err.message);
        }
    }
    const sendToCart= async (id,cartId,quantity)=>{
        
        try {
            let check = await fetch(`http://localhost:3001/cart/${cartId}`);
            let items = await check.json()
            let amount = quantity;
            if(items.find(obj=>obj.product_id === id) !== undefined){
                console.log('update')
                amount +=items.find(obj=>obj.product_id === id).quantity;
                let body = {product_id:id,cart_id:cartId,quantity:amount}
                let response = await fetch(`http://localhost:3001/cart/${cartId}`,{
                method:'PUT',
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(body)
            })
            }
            if(items.find(obj=>obj.product_id === id) === undefined){
                console.log('insert')
                let bodyFirst = {product_id:id,cart_id:cartId,quantity:1}
                let response = await fetch(`http://localhost:3001/cart`,{
                    method:'POST',
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(bodyFirst)
                })
        }
            
        } catch (err) {
            console.error(err.message);
        }
    }
    const getUser = ()=>{
        axios({
            method:'get',
            withCredentials:true,
            url:"http://localhost:3001/getUser",
        }).then((res)=>{
           
            dispatch(loginSlice({data:res.data}));
            
        }
        );
    };
    useEffect(()=>{
        
        if(s.searchTerm !== ''){
            
            if(products2.length>0){
              let newList = products2.filter(item=>item.title.toLowerCase().includes(s.searchTerm))
                setProducts(newList)  
            }
            
            
        }
        else{
            setProducts(products2)
        }
        
        
    },[s.searchTerm])
    useEffect(()=>{
        getProducts();
        getUser();
        
    },[])
    return (
      <div className="ContainerProducts">
        
        {products[0]?<div>{products.map(product=>{
            return <div className="IndividualProduct" key={product.title}>
                <div className="contents">
                    <h3>{product.title}</h3>
                    <h2>${product.price}</h2>
                    <img alt={product.title} src={product.image.toString()}/><br/>
                    <button onClick={()=>sendToCart(product.product_id,IdForCart,1)} >ADD TO CART</button>
                </div>
            </div>
        })}</div>:<h2>No Content</h2>}
      </div>
    );
  }
  
  export default Products;
  