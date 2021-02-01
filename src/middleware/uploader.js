const aws = require( 'aws-sdk' );
const multer = require('multer');
const multerS3 = require( 'multer-s3' );


const s3 = new aws.S3({
 accessKeyId: process.env.AWS_ACCESS_KEY,
 secretAccessKey: process.env.AWS_SECRET,
 region: 'us-west-1'
});

const checkFileType = (file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true)
  } else {
    cb(new Error('Please upload a jpeg or png image'), false)
  }
};

const upload = multer({
storage: multerS3({
  s3: s3,
  bucket: 'harvesttable',
  limits: {fileSize: 5000000},
  fileFilter: function( req, file, cb ){
    checkFileType( file, cb );
   },
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    //console.log(file)
    cb(null, file.originalname + '-' + Date.now())
    
  }
}),
})

module.exports = upload;