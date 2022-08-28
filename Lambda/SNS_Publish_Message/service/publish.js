const AWS = require('aws-sdk');
const util = require('../utils/util');

  
  const sns = new AWS.SNS();
  
AWS.config.update({
    region: 'us-east-1',
})

const publisher = (user)=>{
    let params={
                 Subject:user.Subject,
                 Message: user.Message,
                 TopicArn: "arn:aws:sns:us-east-1:651609363924:farmerorder"
    };
    sns.publish(params,(err,data)=>{
       if(err){
           console.log(err);
       }
       console.log(data);
      
    })
    return util.buildResponse(200,{usermessage:user.Message});;
};

module.exports.publisher = publisher;

