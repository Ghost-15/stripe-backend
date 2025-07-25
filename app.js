require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cors = require("cors");
const corsOptions = require('./middleware/corsOptions')
const connectM = require('./config/dbMongoose')
const mongoose = require('mongoose')
const http = require("http");
const socketIo = require("socket.io");

const app = express();
connectM()

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET","POST"]
  }
});
const webSocketController = require("./controllers/webSocketController")(io);
io.on("connection", (socket) => {
  console.log("Client connecté :", socket.id);

  socket.on("join_user", (userId) => {
    console.log(`Utilisateur ${userId} a rejoint sa room`);
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("Client déconnecté :", socket.id);
  });
});

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', require('./routes/authRoute'));
app.use('/refresh', require('./routes/refreshRoute'));
app.use('/user', require('./routes/userRoute'))
app.use('/marchand', require('./routes/marchandRoute'))
app.use('/transaction', require('./routes/transactionRoute'))
app.use('/webSocket', require('./routes/webSocketRoute')(webSocketController))
app.use('/logout', require('./routes/logoutRoute'));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(errorHandler)

io.on("connection", (socket) => {
  console.log("Client connecté :", socket.id);
  socket.on("disconnect", () => console.log("Déconnecté :", socket.id));
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
})

mongoose.connection.on('error', err => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})

module.exports = app;
