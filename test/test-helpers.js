const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'test-user-1@test.com',
      full_name: 'Test user 1',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      email: 'test-user-2@test.com',
      full_name: 'Test user 2',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      email: 'test-user-3@test.com',
      full_name: 'Test user 3',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      email: 'test-user-4@test.com',
      full_name: 'Test user 4',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ]
}

function makeListingsArray(users) {
  return [
    {
      id: 1, 
      img_location: "https://source.unsplash.com/_zV74zUnwmc/500x500",
      name: "kale",
      location: "Mainstage, Broadway, Sacramento, CA, USA",
      lat: 38.559005330011075,
      lng: -121.48253537546658,
      user_id: users[0].id,
      description: "Photo by Laura Johnston on Unsplash",
      date_modified: new Date().toUTCString(),
      date_created:"Wed Dec 05 2020 08:33:14 GMT-0800",
      }, 
      {
      id: 2, 
      img_location: "https://source.unsplash.com/gXQCELcnI2U/500x500",
      name: "daffodils",
      location: "Main St, Orangevale, Sacramento, CA, USA",
      lat: 38.671668508216705,
      lng: -121.20250687361289,
      user_id: users[0].id,
      description: "Photo by Annie Spratt on Unsplash",
      date_modified: new Date().toUTCString(),
      date_created:"Wed Dec 05 2020 08:33:14 GMT-0800",
      },
      {
      id: 3, 
      img_location: "https://source.unsplash.com/s7r4xjKXo0s/500x500",
      name: "apples",
      location: "Orangevale, CA, USA",
      lat: 38.67985581534705,
      lng: -121.22604676782854,
      user_id: users[0].id,
      description: "Photo by Pierpaolo Riondato on Unsplash",
      date_modified: new Date().toUTCString(),
      date_created:"Wed Dec 05 2020 08:33:14 GMT-0800",
      },
      {
      id: 4, 
      img_location: "https://source.unsplash.com/TFqjlTmkeyY/500x500",
      name: "lemons",
      location: "Main Avenue, Orangevale, CA, USA",
      lat: 38.67339260916394,
      lng: -121.20245947361286,
      user_id: users[1].id,
      description: "Photo by Thitiphum Koonjantuek on Unsplash",
      date_modified: new Date().toUTCString(),
      date_created:"Wed Dec 05 2020 08:33:14 GMT-0800",
      },
      {
      id: 5, 
      img_location: "https://source.unsplash.com/ZZU9Wqzpj-M/500x500",
      name: "Oranges",
      location: "Fair Oaks, CA, USA",
      lat: 38.66248170591882,
      lng: -121.27806123413936,
      user_id: users[1].id,
      description: "Photo by Jeremy Yap on Unsplash",
      date_modified: new Date().toUTCString(),
      date_created:"Wed Dec 05 2020 08:33:14 GMT-0800",
      },
  ];
}


// function makeExpectedListings(userId, photos, photoId) {
//   const expectedPhotos = photos
//     .filter(photo => photo.user_id === userId)
//   if(photoId){
//     const expectedPhoto = expectedPhotos.find(photo => photoId === photo.id)
//     return {
//       id: expectedPhoto.id,
//       caption: expectedPhoto.caption,
//       date_created: expectedPhoto.date_created,
//       summary: expectedPhoto.summary,
//       file_location: expectedPhoto.file_location,
//       age: expectedPhoto.age || null,
//       user_id: expectedPhoto.user_id,
//       album_id: expectedPhoto.album_id,
//     }
//   } else
//   return expectedPhotos.map(photo => {
//     return {
//       id: photo.id,
//       caption: photo.caption,
//       summary: photo.summary,
//       file_location: photo.file_location,
//       date_uploaded: photo.date_uploaded.toISOString(),
//       date_created: photo.date_created,
//       age: photo.age || null,
//       user_id: photo.user_id,
//       album_id: photo.album_id,
//     }
//   })
// }


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
        harvest_table_listings,
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE harvest_table_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE harvest_table_listings_id_seq minvalue 0 START WITH 1`),
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

function seedListingsTables(db, users, listings=[]) {
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


  makeFixtures,
  cleanTables,
  seedListingsTables,
  makeAuthHeader,
  seedUsers,
}