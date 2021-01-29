const path = require('path')
const express = require('express')
const ListingService = require('./listing-service')
const { requireAuth } = require('../middleware/jwt-auth')
const upload = require('../middleware/uploader')


const listingRouter = express.Router()
const jsonParser = express.json()

const serializeListing = listing => ({
    id: listing.id,
    title: listing.title,
    date_modified: listing.date_modified,
    img_location: listing.img_location,
    location: listing.location,
    lat: listing.lat,
    lng: listing.lng,
    description: listing.description,
    user_id: listing.user_id,
  })

listingRouter
  .route('/')
  .get((req, res, next) => {
    ListingService.getAllListings(
      req.app.get('db'),
    )
      .then(listings => {
        res.json(listings)
      })
      .catch(next)
  })
  .post(requireAuth, upload.single('image'), (req, res, next) => {
    const image = req.file.location
    const img_location = image
    const { title, location, lat, lng, description } = req.body
    const user_id = req.user.id
    const newListing = { title, location, lat, lng, description, img_location, user_id}

    for (const field of ['title', 'location', 'lat', 'lng']) {
      if (!req.body[field])  {
            return res.status(400).json({
                error: `Missing '${field}' in request body`
            })
        }
    }
    
    ListingService.insertListing(
      req.app.get('db'),
      newListing
    )
      .then(listing => {
        res
          .status(201)
          .json(serializeListing(listing))
      })
      .catch(next)
  })

  listingRouter
    .route('/:listing_id')
    .all((req, res, next) => {
        ListingService.getById(
        req.app.get('db'),
        req.params.listing_id,
        )
        .then(Listing => {
            if (!Listing) {
            return res.status(404).json({
                error: `Listing doesn't exist`
            })
            }
            res.Listing = Listing
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeListing(res.Listing))
    })  
    .delete(requireAuth, (req, res, next) => {
        ListingService.deleteListing(
        req.app.get('db'),
        req.params.listing_id,
        req.user.id
        )
        .then(send => {
            res.status(200).json({success: `Deleted Successfully`})
        })
        .catch(next)
    })

module.exports = listingRouter;
