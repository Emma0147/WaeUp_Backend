const express = require('express');
const mongoose = require('mongoose');
const {
  registerUser,
  login,
  me,
  logout
} = require('./controller/authController');
const { createQuestion, registerAdmin } = require('./controller/admin');
const { qs, quiz, answers, deleteAll } = require('./controller/user');
// const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require('cors');

// app.use(cors(corsOptions));
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/testdb');
}

app.use(
  cors({
    origin: ['http://127.0.0.1', 'http://localhost:3000', 'http://localhost'],
    credentials: true
  })
);

const corsConfig = {
  origin: true,
  credentials: true
};

app.options(
  ['http://127.0.0.1', 'http://localhost:3000', 'http://localhost'],
  cors(corsConfig)
);

app.use(express.json());
// app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('<h1>Question and Answer Backend</h1>');
});
app.post('/register', registerUser);
app.post('/login', login);
app.get('/me', me);
app.get('/logout', logout);
app.get('/quiz', qs);
app.get('/delete', deleteAll);
app.post('/admin/questions', createQuestion);
app.post('/quiz/answers', answers);
app.post('/register/admin', registerAdmin);
app.get('/quiz/:course', quiz);
app.listen(PORT, () => console.log('server running on port: ' + PORT));

module.exports = app;
