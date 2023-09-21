const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  faculty: String,
  department: String,
  level: String,
  course: { type: String, unique: true },
  q: [
    {
      question: String,
      options: { A: String, B: String, C: String, D: String },
      answer: String
    }
  ]
});

const Question = mongoose.model('question', questionSchema);

module.exports = { Question };
