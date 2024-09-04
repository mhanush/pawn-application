import React from 'react';
import '../styles/Circle.css'; // Import the CSS file for styling

const Circle = ({ value, label }) => {
    return (
        <div className="circle-container">
            <div className="circle">
                {value}
            </div>
            <div className="label">
                {label}
            </div>
        </div>
    );
};

export default Circle;
