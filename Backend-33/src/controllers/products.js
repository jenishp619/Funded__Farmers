
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


const port = 8080;


const getAllListings = (req, res) => {

    let DynamoConfig = {
        region: REGION,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        sessionToken: sessionToken
    }
    AWS.config.update(DynamoConfig);
    let params = {
        TableName: "products33"
    };
    let documentClient = new AWS.DynamoDB.DocumentClient();
    documentClient.scan(params, function (err, data) {
        if (err) {
            console.log(err);
        } else {
           // console.log(data);
            console.log("data.Items", data.Items);
            return res.json({ products: data.Items });
        }
    })
}

const controller = {getAllListings};

module.exports = controller;