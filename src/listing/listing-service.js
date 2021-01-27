

const ListingService = {
    getAllListings(knex) {
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
    
      deleteListing(knex, id) {
        return knex('harvest_table_listings')
          .where('id', id)
          .where('user_id', id)
          .delete()
      },
}

module.exports = ListingService