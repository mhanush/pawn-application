import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../util';
import { ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import Circle from '../components/Circle';

const TimeRangeButtons = ({ onSelect }) => {
  return (
    <div>
      <button onClick={() => onSelect('')}>Today</button>
      <button onClick={() => onSelect('Week')}>Week</button>
      <button onClick={() => onSelect('Month')}>Month</button>
      <button onClick={() => onSelect('Quarter')}>Quarter</button>
      <button onClick={() => onSelect('Halfyear')}>Half-Year</button>
      <button onClick={() => onSelect('Year')}>Year</button>
    </div>
  );
};

function Home() {
  const [loggedUser, setLoggedUser] = useState("");
  const [products, setProducts] = useState([]);
  const [totalStats, setTotalStats] = useState({
    totalAmount: 0,
    totalAmountPaid: 0,
    totalCustomers: 0,
    totalInterest: 0
  });
  const [noDataMessage, setNoDataMessage] = useState(""); // New state for handling no data message

  useEffect(() => {
    setLoggedUser(localStorage.getItem("loggedUser"));
  }, []);

  const navigate = useNavigate();

  const handleLogout = (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedUser');
    handleSuccess("User Logout");
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const fetchProduct = async (timeRange = '') => {
    try {
      setProducts([]); 
      setTotalStats({
        totalAmount: 0,
        totalAmountPaid: 0,
        totalCustomers: 0,
        totalInterest: 0
      });
      setNoDataMessage(""); 
      const url = `http://backend:8080/products${timeRange ? '/' + timeRange : ''}`;
      const headers = {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      };
      const response = await fetch(url, headers);
      const result = await response.json();
      console.log("API Response:", result); // Debugging line
      if (result.success) {
        setProducts(result.data || []);
        setTotalStats({
          totalAmount: result.totalAmount || 0,
          totalAmountPaid: result.totalAmountPaid || 0,
          totalCustomers: result.totalCustomers || 0,
          totalInterest: result.totalInterest || 0
        });
      } else {
        setNoDataMessage(result.message || 'No data found for the selected time range'); // Set the no data message
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

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

      <TimeRangeButtons onSelect={fetchProduct} />

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
                  <td>{item.status ? 'Released' : 'Not Released'}</td>
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
        <div className="circle-stats">
          <Circle value={`₹${totalStats.totalAmount}`} label="Total Amount Given" />
          <Circle value={`₹${totalStats.totalAmountPaid}`} label="Total Amount Released" />
          <Circle value={totalStats.totalCustomers} label="Total Customers" />
          <Circle value={`₹${totalStats.totalInterest}`} label="Total Interest Amount" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Home;
