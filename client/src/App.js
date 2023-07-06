import './App.css';

import Nav from './components/nav/Nav';
import Products from './components/products/products';

function App() {
  return (
    <div className="App">
      
      <header className="App-header">
      <div className="wrapper fadeInDown">
      <div id="loginBar" className="bar">
        <p>You have sucessfully logged in!</p>
        <button id="loginClose" onClick={()=>{
        document.getElementById('loginBar').style.display = 'none';
        }} className="notificationClose">&times;</button> 
      </div>
      <div id="loggedOutBar" className="bar">
        <p>You are sucessfully logged out!</p>
        <button id="loggedOutClose" onClick={()=>{
        document.getElementById('loggedOutBar').style.display = 'none';
        }} className="notificationClose">&times;</button> 
      </div>
      
    </div>
           
        <Nav />
        <Products/>
          
           
      </header>
    </div>
  );
}

export default App;
