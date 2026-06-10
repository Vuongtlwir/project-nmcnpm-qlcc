const MessageFields = {
  id: 'id',
  user_id: 'user_id',
  sender: 'sender',
  text: 'text',
  is_read: 'is_read',
  created_at: 'created_at'
};

module.exports = {
  tableName: 'messages',
  fields: MessageFields
};
