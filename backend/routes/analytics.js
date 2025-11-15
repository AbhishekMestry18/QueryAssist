const express = require('express');
const router = express.Router();
const Query = require('../models/Query');
// const { authenticate, isAdmin } = require('../middleware/auth'); // Authentication disabled

// Get analytics data - optimized with MongoDB aggregation
router.get('/', async (req, res) => {
  try {
    // Use parallel aggregation pipelines for better performance
    const [
      totalCount,
      resolvedCount,
      queryTypes,
      statusDistribution,
      priorityDistribution,
      channelDistribution,
      responseTimeData,
      responseTimeByTag
    ] = await Promise.all([
      Query.countDocuments(),
      Query.countDocuments({ status: { $in: ['resolved', 'closed'] } }),
      Query.aggregate([
        { $group: { _id: '$tag', count: { $sum: 1 } } }
      ]),
      Query.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Query.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      Query.aggregate([
        { $group: { _id: '$channel', count: { $sum: 1 } } }
      ]),
      Query.aggregate([
        { $match: { status: { $in: ['resolved', 'closed'] }, responseTime: { $gt: 0 } } },
        { $group: { _id: null, avg: { $avg: '$responseTime' }, count: { $sum: 1 } } }
      ]),
      Query.aggregate([
        { $match: { status: { $in: ['resolved', 'closed'] }, responseTime: { $gt: 0 } } },
        { $group: { _id: '$tag', avg: { $avg: '$responseTime' } } }
      ])
    ]);
    
    // Format query types
    const queryTypesObj = {
      question: 0,
      request: 0,
      complaint: 0,
      feedback: 0,
      other: 0
    };
    queryTypes.forEach(item => {
      if (queryTypesObj.hasOwnProperty(item._id)) {
        queryTypesObj[item._id] = item.count;
      }
    });
    
    // Format status distribution
    const statusDistObj = {
      new: 0,
      assigned: 0,
      'in-progress': 0,
      resolved: 0,
      closed: 0
    };
    statusDistribution.forEach(item => {
      if (statusDistObj.hasOwnProperty(item._id)) {
        statusDistObj[item._id] = item.count;
      }
    });
    
    // Format priority distribution
    const priorityDistObj = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    };
    priorityDistribution.forEach(item => {
      if (priorityDistObj.hasOwnProperty(item._id)) {
        priorityDistObj[item._id] = item.count;
      }
    });
    
    // Format channel distribution
    const channelDistObj = {
      email: 0,
      social: 0,
      chat: 0,
      community: 0
    };
    channelDistribution.forEach(item => {
      if (channelDistObj.hasOwnProperty(item._id)) {
        channelDistObj[item._id] = item.count;
      }
    });
    
    // Format response time by tag
    const responseTimeByTagObj = {
      question: 0,
      request: 0,
      complaint: 0,
      feedback: 0,
      other: 0
    };
    responseTimeByTag.forEach(item => {
      if (responseTimeByTagObj.hasOwnProperty(item._id)) {
        responseTimeByTagObj[item._id] = Math.round(item.avg);
      }
    });
    
    const avgResponseTime = responseTimeData.length > 0 && responseTimeData[0].count > 0
      ? Math.round(responseTimeData[0].avg)
      : 0;
    
    res.json({
      totalQueries: totalCount,
      resolvedQueries: resolvedCount,
      avgResponseTime,
      queryTypes: queryTypesObj,
      statusDistribution: statusDistObj,
      priorityDistribution: priorityDistObj,
      channelDistribution: channelDistObj,
      responseTimeByTag: responseTimeByTagObj
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

