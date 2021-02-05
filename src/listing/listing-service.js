

const ListingService = {
    getAllListings(knex, term) {
        return knex
          .select('*')
          .from('harvest_table_listings')
      },
    
      insertListing(knex, newListing) {
        return knex
          .insert(newListing)
          .into('harvest_table_listings')
          .where('user_id', newListing.user_id)
          .returning('*')
          .then(rows => {
            return rows[0]
          })
      },
    
      getById(knex, id) {
        return knex
          .from('harvest_table_listings')
          .select('*')
          .where('id', id)
          .first()
      },

      getByTerm(knex, term) {
        return knex
          .from('harvest_table_listings')
          .select('*')
          .where('title', 'ilike', term)
      },
    
      deleteListing(knex, id, userId) {
        return knex('harvest_table_listings')
          .where({
            'id': id,
            'user_id': userId
          })
          .delete()
      },
}

module.exports = ListingService