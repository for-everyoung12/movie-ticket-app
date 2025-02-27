const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  booked_tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
  email_verified: { type: Boolean, default: false },
  payment_methods: [{
    type: { type: String, enum: ['Credit Card', 'PayPal'], required: true },
    last4: { type: String, required: true },
    expiry: { type: String, required: true }
  }]
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
