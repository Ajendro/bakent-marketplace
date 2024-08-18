require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./conexion/mongo');
const cors = require('cors');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRoute = require('./routes/userRoute');
var categoryRoute = require('./routes/categoryRoute');
var productRoute = require('./routes/productRoute');
var paymentMethodRoute = require('./routes/paymentMethodRoute');
var shoppingCartRoute = require('./routes/shoppingCartRoute');
var authenticationRoute = require('./routes/authenticationRoute');
var formRoute = require('./routes/formRoute');
const loginRoute = require('./routes/login');


var app = express();

app.use(cors());

// view engine setu
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/users', userRoute);
app.use('/apiuser', userRoute);
app.use('/apicategory', categoryRoute);
app.use('/apiproduct', productRoute);
app.use('/apipaymethod', paymentMethodRoute);
app.use('/apishoppingCart', shoppingCartRoute);
app.use('/apiauthentication', authenticationRoute);
app.use('/apiform', formRoute);
app.use('/auth', loginRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.post('/apiproduct/products', async (req, res) => {
  const { categoryId } = req.body;
  
  try {
      const filter = categoryId ? { category: categoryId } : {};
      const products = await Product.find(filter);
      res.json(products);
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = app;
