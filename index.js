const express = require('express')
const app = express();
const mongoose = require('mongoose')
const helmet = require('helmet')
const morgan = require('morgan')
const dotenv = require("dotenv");
const multer=require('multer')
const cors=require('cors')
const ConversationRouter=require('./routes/Conversation')
const Userrouter = require('./routes/users');
const Authrouter = require('./routes/auth');
const Feedrouter = require('./routes/Feed');
const path = require("path");
const MessagesRouter = require('./routes/Messages');
const { header } = require('express/lib/request');
dotenv.config();
 
//connection
mongoose.connect(process.env.MongodbURL)
  .then(() => {
    console.log("Successfully connected ");
  })
  .catch((error) => {
    console.log(`can not connect to database, ${error}`);
  });



//middleware
app.use(express.json())
app.use(cors({
  origin:'https://connectmernstack.herokuapp.com',
  // Policy:cross-origin,
  credentials:true,
  allowedHeaders:true
}))
app.use(helmet())
app.use(morgan('common'))
app.use("/images", express.static(path.join(__dirname, "public/images")));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
  
  const upload = multer({ storage: storage });
  app.post("/upload", upload.single("file"), (req, res) => {
    try {
      return res.status(200).json("File uploded successfully");
     
    } catch (error) {
      console.error(error);
    }
  });
app.use('/users',Userrouter)
app.use('/auth',Authrouter)
app.use('/feed',Feedrouter)
app.use('/conversation',ConversationRouter)
app.use('/messages',MessagesRouter)

//operations
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
const PORT=process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log("port is running")
}) 

const io = require('socket.io')(server,{
  pingTimeout: 80000,
    cors:{
        origin:"https://connectmernstack.herokuapp.com/"
    }
})
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    //when connect
    console.log("a user connected.");
  
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });
  
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });