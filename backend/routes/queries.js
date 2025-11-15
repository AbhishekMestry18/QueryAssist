const express = require('express');
const router = express.Router();
const Query = require('../models/Query');
const { detectTag, detectPriority } = require('../utils/autoTagging');
// const { authenticate, isAdmin } = require('../middleware/auth'); // Authentication disabled

// Get all queries with filters
router.get('/', async (req, res) => {
  try {
    const { status, tag, priority, channel, assignedTo } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (tag) filter.tag = tag;
    if (priority) filter.priority = priority;
    if (channel) filter.channel = channel;
    if (assignedTo) filter.assignedTo = assignedTo;
    
    const queries = await Query.find(filter)
      .populate('assignedTo', 'name department')
      .select('-history') // Exclude history for list view to improve performance
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance
    
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single query
router.get('/:id', async (req, res) => {
  try {
    const query = await Query.findById(req.params.id)
      .populate('assignedTo', 'name department email');
    
    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }
    
    res.json(query);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new query
router.post('/', async (req, res) => {
  try {
    const { channel, senderName, senderEmail, subject, message } = req.body;
    
    // Auto-tagging and priority detection
    const tag = detectTag(subject, message);
    const priority = detectPriority(tag, subject, message);
    
    const query = new Query({
      channel,
      senderName: senderName || 'Anonymous',
      senderEmail: senderEmail || '',
      createdBy: null,
      subject,
      message,
      tag,
      priority
    });
    
    // Add initial history entry
    query.history.push({
      action: 'Query created',
      performedBy: senderName || 'System',
      note: `Auto-tagged as ${tag} with ${priority} priority`
    });
    
    await query.save();
    res.status(201).json(query);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update query (assign, change status, etc.)
router.put('/:id', async (req, res) => {
  try {
    const { status, assignedTo, assignedToName, note } = req.body;
    const query = await Query.findById(req.params.id);
    
    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }
    
    // Track changes in history
    const changes = [];
    if (status && status !== query.status) {
      changes.push(`Status changed from ${query.status} to ${status}`);
      query.status = status;
    }
    
    if (assignedTo) {
      if (query.assignedTo?.toString() !== assignedTo) {
        changes.push(`Assigned to ${assignedToName || 'team'}`);
        query.assignedTo = assignedTo;
        query.assignedToName = assignedToName || '';
        if (query.status === 'new') {
          query.status = 'assigned';
        }
      }
    }
    
    if (changes.length > 0) {
      query.history.push({
        action: changes.join(', '),
        performedBy: req.body.performedBy || 'System',
        note: note || ''
      });
    }
    
    await query.save();
    // Populate before sending response
    await query.populate('assignedTo', 'name department email');
    
    res.json(query);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete query
router.delete('/:id', async (req, res) => {
  try {
    const query = await Query.findByIdAndDelete(req.params.id);
    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }
    res.json({ message: 'Query deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

