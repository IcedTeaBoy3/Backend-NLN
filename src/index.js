const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db = require('./config/db');
const routes = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// Load env variables
dotenv.config();
// Cors
app.use(cors(
    {
        origin: process.env.CLIENT_URL, // Địa chỉ frontend
        credentials: true,
    }
));
// Body parser
app.use(express.json({ limit: '50mb' }));
// Body parser
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Cookie parser
app.use(cookieParser());
// Port
const Port = process.env.PORT || 3001;
// Connect to MongoDB
db.connect();
// Routes
routes(app);


app.listen(Port, () => {
    // console.log('Server is running on port '+Port);
});