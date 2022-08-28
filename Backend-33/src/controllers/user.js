const constants = require("../../constants/constants");
const { v4: uuidv4 } = require('uuid');
const AWS = require("aws-sdk");
const multer = require('multer');
const fs = require("fs");





let accessKeyId = constants.accessKeyId;
let secretAccessKey = constants.secretAccessKey;
let sessionToken = constants.sessionToken;
let images_bucket = constants.images_bucket;


const login = (req, res) => {
    try {
        // first checking body contains both email and password and then checking if email exist

        let DynamoConfig = {
            region : "us-east-1",
            endpoint: "http://dynamodb.us-east-1.amazonaws.com",
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            sessionToken:sessionToken
        }

        AWS.config.update(DynamoConfig);
     

        let doClient = new AWS.DynamoDB.DocumentClient();
        if (req && req.body && req.body.email) {
            let params = {
                Key: {
                    "email": "jenish.patel@dal.ca"
                },
                TableName: "users"
            };
            doClient.get(params, function (err,data){
                if(err){
                    console.log("Err",err);
                } else {
                    console.log("data: ",data);
                }
            })
       

        } else {
            return res.status(400).json({success: false, message: "sfa"})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "sdf", success: false });
    }
};

const registerUser = (req,res) => {
        try {
        console.log("req",req.body);
        // check for inputs and apply validation
        if (req && req.body && req.body.name && req.body.email && req.body.phone_number) {

            let name = req.body.name;
            let email = req.body.email;
            let phone_number = req.body.phone_number;

            
            name = name.trim();

            email = email.trim();
            phone_number = phone_number.trim();

            
            let user_params = {
                "id": uuidv4(),
                "name": name,
                "email": email,
                "phone_number": phone_number,
            }

            let tableParams = {
                TableName: "users",
                Item: user_params
            }

            let DynamoConfig = {
                region : "us-east-1",
                endpoint: "http://dynamodb.us-east-1.amazonaws.com",
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
                sessionToken:sessionToken
            }

            AWS.config.update(DynamoConfig);
            let uploadDBData = new AWS.DynamoDB.DocumentClient();
            console.log("LINE 110");
            uploadDBData.put(tableParams,function(err,data){
                console.table(data);
                console.log("data: "+data);
                if(err){
                    console.log("err: ",err);
                } else{
                    console.log("data",data);
                }
            })
            res.json({"message": "Insert successful" });

        }
    } catch (error) {
        console.log("err: ",error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}


var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/images/')
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
});

const filefilter=(req, file, cb)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype==='image/jpg' || file.mimetype==="image/png"){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

var upload= multer({
    storage: storage,
    fileFilter: filefilter
});


const uploadImage = upload.array('photo',10);
const addproduct = (req,res) => {
    try{

        let s3 = new AWS.S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            Bucket: images_bucket,
            sessionToken: sessionToken
        });
        const file = req.files;
        if(file){
            let names = [];
            let imageurls = [];
            let j = 0;
            for(let i in file){
                //console.log(file[i]);
                names.push(file[i].filename);
                fs.readFile("/home/ec2-user/FarmerCloud/Backend-33/public/images/"+file[i].filename, (error, data) => {
                    if(error) {
                        throw error;
                    }
                    const params = {
                        Bucket: images_bucket,
                        Key: file[i].filename,
                        Body: data
                    };
                    s3.createBucket({
                        Bucket: images_bucket
                    }, function () {
                        s3.upload(params, function (err, s3data) {
                            if (err) {
                                console.log(err);
                            } else {
                                //console.log(i+" Successfully uploaded data to bucket on "+ s3data['Location']);
                                imageurls.push(s3data['Location']);
                                // console.log(JSON.stringify(imageurls));
                                let imgurllink= JSON.stringify(imageurls[0]);
                                console.log(imgurllink);
                               // fs.unlinkSync(__dirname + "../../../public/images/"+file[i].filename);
                                j++;
                                if(j===file.length){
                                    let data = JSON.stringify(req.body);
                                    console.log(data);
                                    let image_url = imgurllink;
                                    strimg = image_url.replace(/^"|"$/g, '');
                                    let product_name = req.body.product_name;
                                    let product_description = req.body.product_description;
                                    let price = req.body.price;
                                    console.log(product_name, product_description);
                                    let product_params = {
                                        "id" : uuidv4().toString(),
                                        "product_name" : product_name,
                                        "product_description" : product_description,
                                        "price" : price,
                                        "product_image_url" : strimg
                                    }

                                    let tableParams = {
                                        TableName: "products33",
                                        Item: product_params
                                    }

                                    let DynamoConfig = {
                                        region : "us-east-1",
                                        endpoint: "http://dynamodb.us-east-1.amazonaws.com",
                                        accessKeyId: accessKeyId,
                                        secretAccessKey: secretAccessKey,
                                        sessionToken:sessionToken
                                    }

                                    AWS.config.update(DynamoConfig);
                                    let uploadDBData = new AWS.DynamoDB.DocumentClient();
                                    uploadDBData.put(tableParams,function(err,data){
                                        console.log("data: "+data);
                                        if(err){
                                            console.log("err: ",err);
                                        } else{
                                            console.log("data",data);
                                        }
                                    });
                                    res.json({"message": "Inserted product data successfully" });
                                }
                            }
                        });
                    });
                });
            }
        }
    } catch (error) {
        console.log("Error Occurred :"+error);
        return res.status(500).json({ message: error, success: false });
    }
}


const controller = { login, registerUser, addproduct, uploadImage };

module.exports = controller;