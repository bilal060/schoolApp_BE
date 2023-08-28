const express = require('express');
const morgan = require('morgan');
const path = require('path')
const userRouter = require('./routes/userRoutes');
const studentUserRouter = require('./routes/studentUserRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AlertRouter = require('./routes/AlertRoute');
const countryRouter = require('./routes/countryRoute');
const eventsRouter = require('./routes/eventsRoutes');
const bookRouter = require('./routes/bookRoutes');
const faqRouter = require('./routes/faqRoute');
const studentRouter = require('./routes/studentRoute');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const app = express();
const bodyParser = require('body-parser'); 
const sanitizeHtml = require('sanitize-html');
app.use(express.json({limit:'10kb'}));
function checkForHTMLTags(req, res, next) {
  const { body } = req;
  const keys = Object.keys(body);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = body[key];

    if (typeof value === 'string' && sanitizeHtml(value) !== value) {
      return res.status(400).json({ error: 'HTML tags are not allowed in the request body' });
    }
  }
  next();
}
app.use(checkForHTMLTags);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet())
app.use(mongoSanitize())
app.use(hpp({
  whitelist:[
    'duration',
    'price'
  ]
}))
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({ 
  max:100,
  windowMs: 60 * 60 * 100,
  message:'To many request from this IP now please wait for an hour!'
})
app.use('/api',limiter)
app.use(express.json({limit:'10kb'}));
app.use(express.static(`${__dirname}/public`))
app.use('/uploads/Book', express.static(path.join('uploads', 'Book')));
app.use('/uploads/user', express.static(path.join('uploads', 'user')));
app.use('/uploads/studentUser', express.static(path.join('uploads', 'studentUser')));
// app.use('/api/v1/tours', tourRouter);
 app.use('', userRouter);
// app.use('/api/v1/review', reviewRouter);
app.use('', AlertRouter);
app.use('', countryRouter);
app.use('', eventsRouter);
app.use('', bookRouter);
app.use('', faqRouter);
app.use('', studentRouter);
app.use('', studentUserRouter);
app.all('*',(req,res,next)=>{
  next(new AppError(`Can't find ${req.originalUrl} on this server!`,404))
})
app.use(globalErrorHandler)

module.exports = app;




