/**
 * Complaint Model definition
 */
const ComplaintFields = {
  id: 'id',
  user_id: 'user_id',
  title: 'title',
  type: 'type',
  content: 'content',
  status: 'status',
  response: 'response',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

module.exports = {
  tableName: 'complaints',
  fields: ComplaintFields
};
