/**
 * Payment Model definition
 */
const PaymentFields = {
  id: 'id',
  payment_code: 'payment_code',
  fee_id: 'fee_id',
  resident_id: 'resident_id',
  amount: 'amount',
  payment_date: 'payment_date',
  method: 'method',
  note: 'note',
  status: 'status',
  created_at: 'created_at'
};

module.exports = {
  tableName: 'payments',
  fields: PaymentFields
};
