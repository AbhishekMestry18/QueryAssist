// Auto-tagging logic based on message content
function detectTag(subject, message) {
  const text = (subject + ' ' + message).toLowerCase();
  
  // Complaint keywords
  const complaintKeywords = ['complaint', 'disappointed', 'unhappy', 'poor', 'terrible', 'awful', 'bad service', 'refund', 'cancel'];
  if (complaintKeywords.some(keyword => text.includes(keyword))) {
    return 'complaint';
  }
  
  // Request keywords
  const requestKeywords = ['request', 'please', 'need', 'want', 'require', 'order', 'purchase', 'buy'];
  if (requestKeywords.some(keyword => text.includes(keyword))) {
    return 'request';
  }
  
  // Question keywords
  const questionKeywords = ['?', 'how', 'what', 'when', 'where', 'why', 'who', 'question', 'help', 'explain'];
  if (questionKeywords.some(keyword => text.includes(keyword))) {
    return 'question';
  }
  
  // Feedback keywords
  const feedbackKeywords = ['feedback', 'suggestion', 'improve', 'recommend', 'review', 'opinion'];
  if (feedbackKeywords.some(keyword => text.includes(keyword))) {
    return 'feedback';
  }
  
  return 'other';
}

// Priority detection based on tag and keywords
function detectPriority(tag, subject, message) {
  const text = (subject + ' ' + message).toLowerCase();
  
  // Urgent keywords
  const urgentKeywords = ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'broken', 'down', 'not working'];
  if (urgentKeywords.some(keyword => text.includes(keyword))) {
    return 'urgent';
  }
  
  // High priority for complaints
  if (tag === 'complaint') {
    return 'high';
  }
  
  // Medium priority for requests
  if (tag === 'request') {
    return 'medium';
  }
  
  // Low priority for feedback and questions
  if (tag === 'feedback' || tag === 'question') {
    return 'low';
  }
  
  return 'medium';
}

module.exports = { detectTag, detectPriority };

