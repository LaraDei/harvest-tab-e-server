// const knex = require('knex')
// const app = require('../src/app')
// const helpers = require('./test-helpers')

// describe('Search Endpoint', function() {
//   let db

//   const {
//     testUsers,
//     testListings,
//   } = helpers.makeFixtures()

//   before('make knex instance', () => {
//     db = knex({
//       client: 'pg',
//       connection: process.env.TEST_DATABASE_URL,
//     })
//     app.set('db', db)
//   })

//   after('disconnect from db', () => db.destroy())

//   before('cleanup', () => helpers.cleanTables(db))

//   afterEach('cleanup', () => helpers.cleanTables(db))

//   describe(`GET /api/search`, () => {

//         context('Given there are listings in the database', () => {
//           beforeEach('insert listings', () =>
//             helpers.seedTables(
//               db,
//               testUsers,
//               testListings,
//             )
//           )
    
//           it('responds with 200 and the listings that match the term', () => {
//             const term = 'kale'
//             const expextedListings = helpers.makeExpectedListingTerm(
//                 testListings, term
//             )
//             return supertest(app)
//               .get(`/api/search?q=${term}`)
//               .expect(200, expextedListings)
//         })
//     })
// })
// })
 