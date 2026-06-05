/**
 * Fee Model definition
 */
const FeeFields = {
  id: 'id',
  fee_code: 'fee_code',
  name: 'name',
  type: 'type',
  amount: 'amount',
  description: 'description',
  apartment_id: 'apartment_id',
  due_date: 'due_date',
  status: 'status',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

module.exports = {
  tableName: 'fees',
  fields: FeeFields
};
