const mongoose = require('mongoose');

const pageViewSchema = new mongoose.Schema({
  path: { 
    type: String, 
    required: true,
    unique: true
  },
  count: { 
    type: Number, 
    default: 0 
  },
  lastVisit: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

const PageView = mongoose.model('PageView', pageViewSchema);

module.exports = PageView;
