import './App.css';
import { Routes,Route, Navigate} from 'react-router-dom';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Login from './pages/Login';
import { useState } from 'react';
import RefreshHandler from './RefreshHandler';
import Search from './pages/Search';
import Release from './pages/Release';
import Add from './pages/Add';
import Edit from './pages/Edit'
function App() {
  const [isAuthenticated,setisAuthenticated]=useState(false);

  const PrivateRoute = ({element})=>{
    return isAuthenticated?element : <Navigate to='/login'/>
  }

  return (
    <div className="App">
      <RefreshHandler setisAuthenticated={setisAuthenticated}/>
      <Routes>
        <Route path="/" element={< Navigate to = "/login"/>}/> 
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/release" element={<Release/>}/>
        <Route path="/edit" element={<Edit/>}/>
        <Route path="/add" element={<Add/>}/>
        <Route path="/home" element={<PrivateRoute element = {<Home/>}/>}/>
      </Routes>
    </div>
  );
}

export default App;
