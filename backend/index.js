const express = require('express');
const app = express();
const cors = require('cors')
const session = require('express-session');
const passport = require('passport');
app.use(cors());
require('dotenv').config();
const morgan = require('morgan');
const dbConnection = require('./config/db');
const port = process.env.PORT;
app.use(express.json());
require('./config/passport');


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());



const authRouter = require('./Routers/authRouter');
const collectionsRouter = require('./Routers/collectionsRouter');

const userRouter = require('./Routers/userRouter')
const reviewRouter = require('./Routers/reviewRouter')
const productRouter = require('./Routers/productRouter')
const cartRouter = require('./Routers/cartRouter')
const orderRouter = require('./Routers/orderRouter')
const aboutRouter = require('./Routers/aboutUsRouter');
const dashboardRoutes = require('./Routers/dashboardRoutes');

const contactRouter = require('./Routers/contactRouter')
const FeedbackProductRouter = require('./Routers/FeedbackProductRouter')
const bannerRouter = require('./Routers/bannerRoutes')
const globalError = require('./middleWare/globalError')
const ApiError = require('./utils/apiError')
app.use('/v1/auth', authRouter);
app.use('/api/v1/collections', collectionsRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/about', aboutRouter);
app.use('/api/v1/contact', contactRouter)
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/feedback', FeedbackProductRouter)
app.use('/api/v1/banner', bannerRouter)

dbConnection()
//middleWare 
app.use(express.json());

app.use((req, res, next) => {
    console.log("Welcome to middleWare");
    next();
})


// app.all('*', (req, res, next) => {
//     next(new ApiError(`this route ${req.originalUrl} not found` , 400))

// })

//global error handling middleware
app.use(globalError)


if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))

}


app.listen(3000, () => {
    console.log(`server is running on port 3000`)
})