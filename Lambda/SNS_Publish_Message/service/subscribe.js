const AWS = require('aws-sdk');
const util = require('../utils/util');
  
  const sns = new AWS.SNS();
  
AWS.config.update({
    region: 'us-east-1',
})
const subscriber = (user)=>{
    let params = {
      Protocol: "EMAIL",
      TopicArn: "arn:aws:sns:us-east-1:651609363924:farmerorder",
      Endpoint: user.email,
    };
    sns.subscribe(params, (err, data) => {
      if (err) {
        console.log(err);
      }
      console.log(data);
      console.log("Successfully subscribe to email");
      
    });
    return util.buildResponse(200,{username:user.email});
  };
    

module.exports.subscriber = subscriber;

