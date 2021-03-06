const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const recipeRoutes = require('./routes/recipe.routes');
const carnetRoutes = require('./routes/carnet.routes');
const interactionRoutes = require('./routes/interaction.routes');
require('dotenv').config({path: './config/.env'});
require('./config/db');
const {checkUser, checkAdmin, requireAuth} = require('./middleware/auth.middleware');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}
app.use(cors(corsOptions));
// serve all static files inside public directory display images
app.use(express.static('public')); 
app.use('/uploads/posts/videos/', express.static("uploads/posts/videos/"));
app.use('/uploads/profils/', express.static("uploads/profils/"));
app.use('/uploads/', express.static("uploads"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// jwt
//app.get('*', requireAuth);
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
});

// routes
app.use('/api/user',userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recipe',recipeRoutes);
app.use('/api/carnet',carnetRoutes);
app.use('/api/interaction',interactionRoutes);

// server
app.listen( process.env.PORT, () => {
  console.log(`Listening on port `+ process.env.PORT);
})