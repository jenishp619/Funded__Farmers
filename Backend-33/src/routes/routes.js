const express = require("express");
const user = require("../controllers/user.js");
const products = require("../controllers/products.js");
const productdetails = require("../controllers/product_details.js");
const AWS = require("aws-sdk");
const {v4: uuidv4} = require("uuid");
const multer  = require('multer');
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const constants = require("../../constants/constants");

app.use(express.static("./public"))
app.use(cors());

const router = express.Router();
const ACCESSID = constants.accessKeyId;
const ACCESKEY = constants.secretAccessKey;
const ACCESSTOKEN = constants.sessionToken;
const REGION = "us-east-1";
const promisify = require('util').promisify;
const fs = require('fs');
const readFile = promisify(fs.readFile);


router.post("/register", user.registerUser);
router.post("/login", user.login);
router.post("/addproduct", user.uploadImage, user.addproduct);
router.get("/getproducts",products.getAllListings);
router.get("/get-product-details/:uuid",productdetails.getProductdetails);






router.post('/trigger-lambda-2', async (req,res) => {
    AWS.config.update({
        region : "us-east-1",
        accessKeyId: ACCESSID,
        secretAccessKey: ACCESKEY,
        sessionToken: ACCESSTOKEN
    });

    let json = {"name":"John"};
    json = JSON.stringify(json);
    let lambda = new AWS.Lambda();
    let params = {
        FunctionName: 'send-notification', /* required */
        Payload: json
    };
    lambda.invoke(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
    console.log("Line 184");
})


var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});

router.post('/storedata' , upload.single('image'), async (req,res) => {
    console.log("req"+req.toString());
    console.log("req"+req.json);
    console.log("req.file : "+req.file);
    console.log("req.file filename : "+req.file.filename);
    console.log("req.body.product_name: ", req.body.product_name);
    console.log("req.body.description: ", req.body.description);
    console.log("req.body.Price: ", req.body.price);
    console.log("Req.body.userinformation sasd", req.body.userInformation);

    imagePath = "public\/images\/"+req.file.filename;

    const data = await readFile(imagePath);
    // Wait until the file is read
    // return uploadToS3('key', 'modifier', data);


    // fs.readFile('.public/images/'+req.file.filename, function (err, data) {
    //   if (err) { throw err; }
    //   bufferedData = new Buffer(data, 'binary');



    const s3bucket = new AWS.S3({
        accessKeyId: ACCESSID,
        secretAccessKey: ACCESKEY,
        sessionToken: ACCESSTOKEN
    });

    const params = {
        Bucket: "b00899517-bucket-testing",
        Key: req.file.filename,
        Body: data,
        ACL: 'public-read',
        ContentType: 'image/png',

    };

    let fileLocation;
    s3bucket.upload(params, function(err, data) {
        if (err) throw err;
        console.log(`File uploaded successfully at ${JSON.stringify(data)}`)
        console.log("data :"+ data['Location']);
        console.log("data :"+ data.Location);
        fileLocation = data.Location;
        console.log("let fileLocation; "+fileLocation);

        console.log("fileLocation: ",fileLocation);
        let product_params = {
            "uuid": uuidv4(),
            "product_image_url": fileLocation,
            "product_name" : req.body.product_name,
            "product_description": req.body.description,
            "price": req.body.price,
            "user_information": req.body.userInformation
        }

        let tableParams = {
            TableName: "products",
            Item: product_params
        }

        let DynamoConfig = {
            region : REGION,
            // endpoint: "http://dynamodb.us-east-1.amazonaws.com",
            accessKeyId: ACCESSID,
            secretAccessKey: ACCESKEY,
            sessionToken: ACCESSTOKEN
        }


        AWS.config.update(DynamoConfig);
        let uploadDBData = new AWS.DynamoDB.DocumentClient();

        uploadDBData.put(tableParams,function(err,data){
            console.log("data: "+data);
            if(err){
                console.log("err: ",err);
            }
        })
        res.json({"s3uri": fileLocation });


    })




})

module.exports = router;
