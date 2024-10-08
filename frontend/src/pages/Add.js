import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../util';
import {ToastContainer} from 'react-toastify';
import { Link } from 'react-router-dom';
function Add() {
    const [loggedUser,setloggedUser]=useState("");
    const [products,setProducts] = useState([]);
    const [mobileNo, setMobileNo] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [gram, setGram] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('');
    const [model, setModel] = useState('');
    const [rateofintrest, setRateOfIntrest] = useState('');
    useEffect(() => {
      setloggedUser(localStorage.getItem("loggedUser"));
    }, [])
    const navigate = useNavigate();
    const handleLogout=(e)=>{
        localStorage.removeItem('token');
        localStorage.removeItem('loggedUser');
        handleSuccess("User Logout");
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    }
    const  fetchProduct = async ()=>{
        const SearchInfo = {};
        if (mobileNo) SearchInfo.mobileNo = mobileNo;
        try {
            const url = "http://13.235.17.159:8080/products/view";
            const headers = {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(SearchInfo),
            };
        const response = await fetch(url,headers);
        const result = await response.json();
        console.log(result);
        if (result.success) {
          setProducts(result.data || []);
      } else {
          handleError(result.message || 'Failed to fetch products');
      }
      } catch (error) {
        handleError(error)
      }
    }
    const AddProduct = async ()=>{
        const AddInfo = {mobileNo,name,address,city,type,model,gram,rateofintrest,amount};
        try {
            const url = "http://backend:8080/products/add";
            const headers = {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(AddInfo),
            };
        const response = await fetch(url,headers);
        const result = await response.json();
        console.log(result);
        if (result.success) {
          handleSuccess('Product added successfully');
          fetchProduct();
      } else {
          handleError(result.message || 'Failed to fetch products');
      }
      } catch (error) {
        handleError(error)
      }
    }
    
  return (
    <div>
        <h1>{loggedUser}</h1>
        <nav className="navbar">
        <ul className="navbar-list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/add">Add</Link></li>
        <li><Link to="/release">Release</Link></li>
        <li><Link to="/search">Search</Link></li>
        <li><Link to="/edit">Edit</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
    <div>
                <label htmlFor="mobileNo">Mobile Number:</label>
                <input
                    type="tel"
                    id="mobileNo"
                    name="mobileNo"
                    pattern="[0-9]{10}"
                    placeholder="Enter your mobile number"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                />

                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="address">Address:</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Enter your Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <label htmlFor="city">City:</label>
                <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter your City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <label htmlFor="type">Type:</label>
                <select
                    id="type"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="">Select Type</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                </select>
                <label htmlFor="model">Model:</label>
                <input
                    type="text"
                    id="model"
                    name="model"
                    placeholder="Enter your Model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                />
                <label htmlFor="gram">Gram:</label>
                <input
                    type="number"
                    id="gram"
                    name="gram"
                    placeholder="Enter your Gram"
                    value={gram}
                    onChange={(e) => setGram(e.target.value)}
                />

                <label htmlFor="amount">Amount:</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    placeholder="Enter your Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <label htmlFor="rateofintrest">RateOfIntrest:</label>
                <input
                    type="number"
                    id="rateofintrest"
                    name="rateofintrest"
                    placeholder="Enter your RateOfIntrest"
                    value={rateofintrest}
                    onChange={(e) => setRateOfIntrest(e.target.value)}
                />
                <button onClick={AddProduct}>
                    Add
                </button>
            </div>

    <div>
                {products.length > 0 ? (
                    <table border="1" cellPadding="10" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Model</th>
                                <th>Type</th>
                                <th>Gram</th>
                                <th>Rate of Interest</th>
                                <th>Amount</th>
                                <th>Amount Paid</th>
                                <th>Status</th>
                                <th>City</th>
                                <th>Address</th>
                                <th>Mobile No</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.model}</td>
                                    <td>{item.type}</td>
                                    <td>{item.gram}</td>
                                    <td>{item.rateofintrest}</td>
                                    <td>{item.amount}</td>
                                    <td>{item.amountpaid}</td>
                                    <td>{item.status ? 'Relased' : 'Not Released'}</td>
                                    <td>{item.city}</td>
                                    <td>{item.address}</td>
                                    <td>{item.mobileNo}</td>
                                    <td>{new Date(item.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No products added</p>
                )}

            </div>
        <ToastContainer/>
    </div>
    
  )
}

export default Add