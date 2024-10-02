import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import { handleError, handleSuccess } from '../util';
function Signup() {
    const[SignupInfo,setSignupInfo]=useState({
        name:"",
        email:"",
        password:""
    })
    const navigate = useNavigate();
    const handleChange=(e)=>{
        const {name,value}=e.target;
        console.log(name,value);
        const copySignupInfo={...SignupInfo}
        copySignupInfo[name]=value;
        setSignupInfo(copySignupInfo);
    }
    console.log(SignupInfo)
    const handleSignup=async(e)=>{
        e.preventDefault();
        const {name,email,password} = SignupInfo;
        if(!name || !email || !password){
            return handleError('name,email,password are required')
        }
        try{
            const url = "http://13.235.17.159:8080/auth/signup";
            const response = await fetch(url,{
                method : "POST",
                headers: {
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(SignupInfo)
            });
            const result = await response.json();
            console.log(result);
            const {success,message,error} = result;
            if(success){
                handleSuccess(message);
                setTimeout(()=>{
                    navigate('/login');
                },1000);
            }else if(error){
                const detail = error?.details[0].message;
                handleError(detail);
            }else if(!success){
                handleError(message);
            }
        }catch(err){
            handleError(err);
        }
    }
  return (
    <div className="conatainer">
        <h1>Signup</h1>
        <form onSubmit={handleSignup}>
            <div>
                <label htmlFor='name'>ShopName</label>
                <input
                    onChange={handleChange}
                    type="text"
                    name="name"
                    autoFocus
                    placeholder="Enter your name.."
                    value={SignupInfo.name}                />
            </div>
            <div>
                <label htmlFor='email'>Email</label>
                <input
                    onChange={handleChange}
                    type="email"
                    name="email"
                    autoFocus
                    placeholder="Enter your email.."
                    value={SignupInfo.email}
                />
            </div>
            <div>
                <label htmlFor='password'>Password</label>
                <input
                    onChange={handleChange}
                    type="password"
                    name="password"
                    placeholder="Enter your password.."
                    value={SignupInfo.password}
                />
            </div>
            <button type="submit">Signup</button>
            <span>Already have an account?
                <Link to="/login">Login</Link>
            </span>
            <ToastContainer/>
        </form>
    </div>
  )
}

export default Signup