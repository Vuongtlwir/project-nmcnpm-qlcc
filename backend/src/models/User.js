/**
 * User Model definition
 */
const UserFields = {
  id: 'id',
  username: 'username',
  email: 'email',
  password: 'password',
  role: 'role',
  full_name: 'full_name',
  phone: 'phone',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

module.exports = {
  tableName: 'users',
  fields: UserFields
};
