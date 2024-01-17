const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  password: { type: String, required: true },
  name:{ type: String, required: true },
  status:{ type: String, required: true },
  profileImage: { type: Object, required:true }
});

module.exports = mongoose.model('User', userSchema);
