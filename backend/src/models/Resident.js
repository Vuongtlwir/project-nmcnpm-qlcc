/**
 * Resident Model definition
 */
const ResidentFields = {
  id: 'id',
  resident_code: 'resident_code',
  apartment_id: 'apartment_id',
  user_id: 'user_id',
  full_name: 'full_name',
  date_of_birth: 'date_of_birth',
  gender: 'gender',
  id_card: 'id_card',
  phone: 'phone',
  email: 'email',
  relation: 'relation',
  status: 'status',
  move_in_date: 'move_in_date',
  move_out_date: 'move_out_date',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

module.exports = {
  tableName: 'residents',
  fields: ResidentFields
};
