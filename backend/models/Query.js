const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: String
});

const querySchema = new mongoose.Schema({
  channel: {
    type: String,
    required: true,
    enum: ['email', 'social', 'chat', 'community']
  },
  senderName: { type: String, required: true },
  senderEmail: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  tag: {
    type: String,
    enum: ['question', 'request', 'complaint', 'feedback', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'assigned', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  assignedToName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  responseTime: { type: Number, default: 0 }, // in minutes
  history: [historySchema]
});

querySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = Date.now();
    if (this.createdAt) {
      this.responseTime = Math.round((this.resolvedAt - this.createdAt) / (1000 * 60));
    }
  }
  next();
});

module.exports = mongoose.model('Query', querySchema);

