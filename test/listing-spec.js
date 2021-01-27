const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Listings Endpoints', function() {
  let db

  const {
    testUsers,
    testListings,
  } = helpers.makeFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/listings`, () => {

        context('Given there are listings in the database', () => {
          beforeEach('insert listings', () =>
            helpers.seedTables(
              db,
              testUsers,
              testListings,
            )
          )
    
          it('responds with 200 and the listings', () => {
            const expextedListings = testListings.map(listing =>
                helpers.makeExpectedListing(
                listing
            )
            )
            return supertest(app)
              .get(`/api/listings`)
              .expect(200, expextedListings)
          })
        })
  })

  describe(`GET /api/listings/:listing_Id`, () => {
    context(`Given no listing`, () => {
        it(`responds with 404`, () => {
          const listingId = 123456
          return supertest(app)
            .get(`/api/listings/${listingId}`)
            .expect(404, { error: `Listing doesn't exist` })
        })
      })

    context('Given there are listings in the database', () => {
      beforeEach('insert listings', () =>
        helpers.seedTables(
          db,
          testUsers,
          testListings,
        )
      )

      it('responds with 200 and the listing', () => {
        const listingId = 1
        const expectedListing = helpers.makeExpectedListing(
          testListings, listingId
        )

        return supertest(app)
          .get(`/api/listings/${listingId}`)
          .expect(200, expectedListing)
      })
    })
})

  describe(`POST /api/listings`, () => {
    beforeEach('insert listing', () =>
      helpers.seedTables(
        db,
        testUsers,
        testListings,
      )
    )

    it(`creates an listing, responding with 201 and the new listing`, function() {
      //this.retries(3)
      const testUser = testUsers[0]
      const newListing = {
        title: 'Test new listings',
        lat: 38.673392609163944,
        lng: -121.27806123413936,
        location: 'test ave. Somewhere, CA',
        user_id: testUser.id
      }
      return supertest(app)
        .post('/api/listings')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newListing)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.title).to.eql(newListing.title)
          expect(res.body.location).to.eql(newListing.location)
          expect(res.body.lat).to.eql(newListing.lat)
          expect(res.body.lng).to.eql(newListing.lng)
          expect(res.body.user_id).to.eql(newListing.user_id)
          const expectedDate = new Date(res.body.date_created).toLocaleString()
          const actualDate = new Date(res.body.date_created).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        })
    })

    const requiredFields = ['title', 'location', 'lat', 'lng']

    requiredFields.forEach(field => {
      const testUser = testUsers[0]
      const newListing = {
        title: 'Test new listings',
        lat: 38.673392609163940,
        lng: -121.27806123413936,
        location: 'test ave. Somewhere, CA',
        user_id: testUser.id
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newListing[field]

        return supertest(app)
          .post('/api/listings')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(newListing)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })
  })


  describe(`DELETE /api/listings/:listingId`, () => {
    context('Given there are listings in the database', () => {
      beforeEach('insert listings', () =>
        helpers.seedTables(
          db,
          testUsers,
          testListings,
        )
      )
    
        it('responds with 200 and removes the listing', () => {
            const idToRemove = testListings[0].id
            // const userId = testUsers[0].id
            // const expectedListing =  helpers.makeExpectedListing(
            //   testListings, idToRemove
            // )
            return supertest(app)
                .delete(`/api/listings/${idToRemove}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, {success: `Deleted Successfully`})
        })
    })
})
})