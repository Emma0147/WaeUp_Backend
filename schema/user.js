const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    unique: true,
    type: String
  },
  passwordHash: String,
  phone: {
    unique: true,
    type: String
  },
  gender: String,
  faculty: String,
  department: String,
  level: String,
  matricNo: {
    unique: true,
    type: String
  },
  results: { course: String, score: Number },
  quizs: mongoose.SchemaTypes.ObjectId
});

module.exports = mongoose.model('User', userSchema);
