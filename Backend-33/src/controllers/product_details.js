
const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const path = require('path');
const app = express();
const constants = require("../../constants/constants");
app.use(express.static("./public"))
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const accessKeyId = constants.accessKeyId;
const secretAccessKey = constants.secretAccessKey;
const sessionToken = constants.sessionToken;
const REGION = "us-east-1";
const AWS = require('aws-sdk');

const getProductdetails = (req, res) => {
  try {
    var userEmail;
    console.log("LINE 163", req.params.uuid);
    let DynamoConfig = {
      region: REGION,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      sessionToken: sessionToken,
    };
    AWS.config.update(DynamoConfig);
        
    let params = {
        TableName: "products33",
        Key: {
        "id": req.params.uuid,
      }
      
    };
    let documentClient = new AWS.DynamoDB.DocumentClient();
    //console.log(`params=${JSON.stringify(params)}`);
    documentClient.get(params, function (err, data) {
      if (err) {
        console.error(JSON.stringify(err));
      } else {
        console.log("data",data.Item);
           product_name = data.Item.product_name;
        // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$data", data);
         console.log("line 48", product_name);
        
          let responseObject = {
            product_name: data.Item.product_name,
            product_description: data.Item.product_description,
            price: data.Item.price,
            product_image_url: data.Item.product_image_url,
    
          };
          res.status(200).json({ success: true, data: responseObject });
        console.log("line 57", product_name);
      }
    });
  } catch (e) {}
};

const controller = { getProductdetails}

module.exports = controller;
