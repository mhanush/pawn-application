import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../util';
import {ToastContainer} from 'react-toastify';
import { Link } from 'react-router-dom';
function Release() {
    const [loggedUser,setloggedUser]=useState("");
    const [products,setProducts] = useState([]);
    const [mobileNo, setMobileNo] = useState('');
    const [id, setId] = useState('');
    const [releaseid, setReleaseId] = useState('');
    const [amountpaid, setAmountPaid] = useState('');
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
        if (id) SearchInfo.id = id;
        if (mobileNo) SearchInfo.mobileNo = mobileNo;
        try {
            const url = "http://localhost:8080/products/view";
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
            const filteredProducts = result.data.filter(product => !product.status);
            setProducts(filteredProducts);
      }else if(result.status){
        handleError('Item Already Released');
      }else {
          handleError(result.message || 'Failed to fetch products');
      }
      } catch (error) {
        handleError(error)
      }
    }
    const  handleRelease = async ()=>{
        const ReleaseInfo = {
            id: releaseid,
            amountPaid: amountpaid
        };
        try {
            const url = "http://localhost:8080/products/release";
            const headers = {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ReleaseInfo),
            };
        const response = await fetch(url,headers);
        const result = await response.json();
        console.log(result);
        if (result.success) {
          handleSuccess('Item Released Successfully');
          fetchProduct();
      } else {
          handleError(result.message || 'Failed to Release product');
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

                <label htmlFor="id">ID:</label>
                <input
                    type="number"
                    id="id"
                    name="id"
                    placeholder="Enter your ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />

                <button onClick={fetchProduct}>
                    Search
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
                    <p>No products available</p>
                )}
            </div>
            {products.length>0 && products.some(product => !product.status) &&(
                <div>
                <label htmlFor="releaseid">ID:</label>
                    <input
                        type="number"
                        id="releaseid"
                        name="releaseid"
                        placeholder="Enter your ID"
                        value={releaseid}
                        onChange={(e) => setReleaseId(e.target.value)}
                    />
                    <label htmlFor="amountpaid">AmountPaid:</label>
                    <input
                        type="number"
                        id="amountpaid"
                        name="amountpaid"
                        placeholder="Enter Amount Paid"
                        value={amountpaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                    />
                    <div>
                        <button onClick={handleRelease}>Release</button>
                    </div>
                </div>
            )}
        <ToastContainer/>
    </div>
    
  )
}

export default Release