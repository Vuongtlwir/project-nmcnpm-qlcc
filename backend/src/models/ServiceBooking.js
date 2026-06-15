const ServiceBookingFields = {
  id: 'id',
  booking_code: 'booking_code',
  user_id: 'user_id',
  service_id: 'service_id',
  booking_date: 'booking_date',
  booking_time: 'booking_time',
  notes: 'notes',
  status: 'status',
  admin_response: 'admin_response',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

module.exports = {
  tableName: 'service_bookings',
  fields: ServiceBookingFields
};