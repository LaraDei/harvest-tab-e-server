const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'test-user-1@test.com',
      full_name: 'Test user 1',
      password: 'Password1',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      email: 'test-user-2@test.com',
      full_name: 'Test user 2',
      password: 'Password2',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      email: 'test-user-3@test.com',
      full_name: 'Test user 3',
      password: 'Password3',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      email: 'test-user-4@test.com',
      full_name: 'Test user 4',
      password: 'Password4',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ]
}

function makeListingsArray(users) {
  return [
    {
      id: 1, 
      img_location: "https://source.unsplash.com/_zV74zUnwmc/500x500",
      title: "kale",
      location: "Mainstage, Broadway, Sacramento, CA, USA",
      lat: '38.559005330011075',
      lng: '-121.482535375466580',
      user_id: users[0].id,
      description: "Photo by Laura Johnston on Unsplash",
      date_modified: new Date('2029-01-22T16:28:32.615Z'),
      date_created:new Date('2029-01-22T16:28:32.615Z'),
      }, 
      {
      id: 2, 
      img_location: "https://source.unsplash.com/gXQCELcnI2U/500x500",
      title: "daffodils",
      location: "Main St, Orangevale, Sacramento, CA, USA",
      lat: '38.671668508216705',
      lng: '-121.202506873612890',
      user_id: users[0].id,
      description: "Photo by Annie Spratt on Unsplash",
      date_modified: new Date('2029-01-22T16:28:32.615Z'),
      date_created:new Date('2029-01-22T16:28:32.615Z'),
      },
      {
      id: 3, 
      img_location: "https://source.unsplash.com/s7r4xjKXo0s/500x500",
      title: "apples",
      location: "Orangevale, CA, USA",
      lat: "38.679855815347050",
      lng: "-121.226046767828540",
      user_id: users[0].id,
      description: "Photo by Pierpaolo Riondato on Unsplash",
      date_modified: new Date('2029-01-22T16:28:32.615Z'),
      date_created:new Date('2029-01-22T16:28:32.615Z'),
      },
      {
      id: 4, 
      img_location: "https://source.unsplash.com/TFqjlTmkeyY/500x500",
      title: "lemons",
      location: "Main Avenue, Orangevale, CA, USA",
      lat: '38.673392609163940',
      lng: "-121.202459473612860",
      user_id: users[1].id,
      description: "Photo by Thitiphum Koonjantuek on Unsplash",
      date_modified: new Date('2029-01-22T16:28:32.615Z'),
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
      id: 5, 
      img_location: "https://source.unsplash.com/ZZU9Wqzpj-M/500x500",
      title: "Oranges",
      location: "Fair Oaks, CA, USA",
      lat: "38.662481705918820",
      lng: "-121.278061234139360",
      user_id: users[1].id,
      description: "Photo by Jeremy Yap on Unsplash",
      date_modified: new Date('2029-01-22T16:28:32.615Z'),
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
  ];
}


function makeExpectedListing(listings, listingId) {
  if(listingId){
    const expectedListing = listings.find(listing => listingId === listing.id)
    return {
      id: expectedListing.id,
      title: expectedListing.title,
      date_modified: expectedListing.date_modified.toISOString(),
      img_location: expectedListing.img_location || null,
      location: expectedListing.location,
      lat: expectedListing.lat,
      lng: expectedListing.lng,
      description: expectedListing.description || null,
      user_id: expectedListing.user_id,
    }
  } else
    return {
      id: listings.id,
      title: listings.title,
      date_created: listings.date_created.toISOString(),
      date_modified: listings.date_modified.toISOString(),
      img_location: listings.img_location || null,
      location: listings.location,
      lat: listings.lat,
      lng: listings.lng,
      description: listings.description|| null,
      user_id: listings.user_id,
    }
}


function makeFixtures() {
  const testUsers = makeUsersArray()
  const testListings = makeListingsArray(testUsers)
  return { testUsers, testListings}
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        harvest_table_users,
        harvest_table_listings
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE harvest_table_listings_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE harvest_table_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('harvest_table_listings_id_seq', 0)`),
        trx.raw(`SELECT setval('harvest_table_users_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('harvest_table_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('harvest_table_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedTables(db, users, listings) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('harvest_table_listings').insert(listings)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('harvest_table_listings_id_seq', ?)`,
      [listings[listings.length - 1].id],
    )
  })
}


function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeListingsArray,
  makeExpectedListing,
  makeFixtures,
  cleanTables,
  seedTables,
  makeAuthHeader,
  seedUsers,
}