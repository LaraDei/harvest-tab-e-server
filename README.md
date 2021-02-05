### Harvest Table API
# Harvest Table
[Harvest Table](https://harvest-table.vercel.app/ "Harvest Table")

## Harvest Table API
This API allows users from Harvest Table to interact with their accounts. 

## Open Endpoints

# `POST` /api/auth/register
| Name      | Type   | In   | Description |
|-----------|--------|------|-------------|
| password  | string | body | REQUIRED    |
| email     | string | body | REQUIRED    |
| full_name | string | body | REQUIRED    |
`default responses`
* authToken: ******
* Status: 400 'Incorrect email or password'
* Status: 400 'Missing '${key}' in request body'

# `POST` /api/auth/login
| Name     | Type   | In   | Description |
|----------|--------|------|-------------|
| password | string | body | REQUIRED    |
| email    | string | body | REQUIRED    |
`default responses`
* Status: 201 
    * { "authToken": "eyJhbGciOsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjox20ifQ.U-KjAKzBySAnFeshBQoOPK2ErLdgBI",
        "id": "687",
        "full_name": "Test User"}
* Status: 400 'Email already taken'
* Status: 400 'Missing '${key}' in request body'


# `GET`  /api/listings
| Name         | Type  | In    | Description |
|--------------|-------|-------|-------------|
| query        | string| body  | OPTIONAL    |
`default responses`
* Status: 201 JSON Listing data
    * [
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
]

# `GET`  /api/listings/{listing_id}
| Name         | Type   | In             | Description |
|--------------|--------|----------------|-------------|
| album_id     | number | path           | REQUIRED    |
`default responses`
* Status: 201 JSON Listing data
    *  {
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
      }

## All endoints below require Auth`

# `POST`  /api/listings
| Name         | Type   | In             | Description |
|--------------|--------|----------------|-------------|
| bearer token | JWT    | Authorization  | REQUIRED    |
| title        | string | body           | REQUIRED    |
`default responses`
* Status: 401 Unauthorized
* Status: 400 'Missing '${key}' in request body'
* Status: 201 JSON Listing data
    * {
    id: 4,
    title: "apples",
    date_modified: new Date('2029-01-22T16:28:32.615Z'),
    img_location: "https://source.unsplash.com/_zV74zUnwmc/500x500",
    location: listing.location,
    lat: '38.559005330011075',
    lng: '-121.482535375466580',
    description: "",
    user_id: 86,
  }

# `DELETE`  /api/listings/{listing_id}
| Name         | Type   | In             | Description |
|--------------|--------|----------------|-------------|
| bearer token | JWT    | Authorization  | REQUIRED    |
| photo_id     | number | path           | REQUIRED    |
`default responses`
* Status: 401 Unauthorized
* Status: 404 'Listing doesn't exist'
* Status: 200 'Deleted Successfully'

# How to Use Harvest Table
![Landing Page](/src/img/LandingPage.JPG)

Harvest Table allows you to share or find surplus produce in your neighborhood. After creating an account you can create a listing for your produce.
![Create Listing](/src/img/Upload.JPG)

You can see the general layout by clicking on the demo link on the navigation bar. 
![Demo](/src/img/Dashboard.JPG)
There you will see what the user's dashboard looks like with some listings. You will not be able to add listings from the demo dashboard.

You can create an account and sign in to access all of the user functions. 
![Create account](/src/img/Register.JPG)

This app is mobile friendly!
![Mobile Search](/src/img/MobileSearch.JPG)
![Mobile Map](/src/img/MobileMap.JPG)

# API Documentation
[Harvest Table API source code](https://github.com/LaraDei/harvest-table "Harvest Table API source code")


# Technology Used
* JS
* REACT
* JSX
* JQUERY
* CSS
* HTML
* AJAX
* AWS
    * S3
    * IAM
* JWT
* GoogleDev
    * Maps JS
    * Places
    * Geocoding
    * Geolocation
* SQL
* postgresql
* Node
* Heroku
