const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: {
    unique: true,
    type: String
  }
});

module.exports = mongoose.model('Admin', adminSchema);
