const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: 'us-west-1'
  });

const s3 = new aws.S3()

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
      cb(null, true)
    } else {
      cb(new Error('Please upload a jpeg or png image'), false)
    }
};
 
const upload = multer({
  fileFilter: fileFilter,
  limits: {fileSize: 1024 * 1024 * 5},
  storage: multerS3({
    s3: s3,
    bucket: 'lost-puppers',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = upload;

// const aws = require( 'aws-sdk' );
// const multer = require('multer');
// const multerS3 = require( 'multer-s3' );
// const path = require( 'path' );
// const url = require('url');

// const s3 = new aws.S3({
//  accessKeyId: process.env.AWS_ACCESS_KEY,
//  secretAccessKey: process.env.AWS_SECRET,
//  Bucket: 'harvesttable',
//  region: 'us-west-1'
// });

// const checkFileType = (file, cb) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
//     cb(null, true)
//   } else {
//     cb(new Error('Please upload a jpeg or png image'), false)
//   }
// };

// const upload = multer({
// storage: multerS3({
//   s3: s3,
//   bucket: 'harvesttable',
//   acl: 'public-read',
//   contentDisposition: 'attachment',
//   key: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// }),
// fileFilter: function( req, file, cb ){
//   checkFileType( file, cb );
//  },
// limits: {fileSize: 5000000},
// metadata: function (req, file, cb) {
//   cb(null, {fieldName: file.fieldname});
// },
// })

// module.exports = upload;