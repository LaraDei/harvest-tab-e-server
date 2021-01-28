const aws = require( 'aws-sdk' );
const multer = require('multer');
const multerS3 = require( 'multer-s3' );
const path = require( 'path' );


const s3 = new aws.S3({
 accessKeyId: process.env.AWS_ACCESS_KEY,
 secretAccessKey: process.env.AWS_SECRET,
 Bucket: 'harvesttable',
 region: 'us-west-1'
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true)
  } else {
    cb(new Error('Please upload a jpeg or png image'), false)
  }
};

const upload = multer({
fileFilter: fileFilter,
limits: {fileSize: 5000000},
storage: multerS3({
  s3: s3,
  bucket: 'harvesttable',
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