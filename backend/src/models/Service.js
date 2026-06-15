const ServiceFields = {
  id: 'id',
  name: 'name',
  description: 'description',
  price: 'price',
  unit: 'unit',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

module.exports = {
  tableName: 'services',
  fields: ServiceFields
};