/**
 * Apartment Model definition
 */
const ApartmentFields = {
  id: 'id',
  code: 'code',
  floor: 'floor',
  building: 'building',
  area: 'area',
  num_rooms: 'num_rooms',
  status: 'status',
  owner_name: 'owner_name',
  owner_phone: 'owner_phone',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

module.exports = {
  tableName: 'apartments',
  fields: ApartmentFields
};
