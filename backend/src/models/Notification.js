/**
 * Notification Model definition
 */
const NotificationFields = {
  id: 'id',
  user_id: 'user_id',
  title: 'title',
  content: 'content',
  type: 'type',
  is_read: 'is_read',
  created_at: 'created_at'
};

module.exports = {
  tableName: 'notifications',
  fields: NotificationFields
};
