const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const app = express();

require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;
app.use(bodyparser.json());
app.use(cors());
app.use('/auth',AuthRouter);
app.use('/products',ProductRouter);
app.listen(PORT , ()=> {
    console.log(`server is running on ${PORT}`)
})