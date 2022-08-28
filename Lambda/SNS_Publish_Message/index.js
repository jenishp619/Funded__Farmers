const farmpath='/farm';
const subscribepath='/subscribe';
const publishpath='/publish';

const util = require('./utils/util');

const publishservice = require('./service/publish');
const subscribeservice = require('./service/subscribe');

exports.handler = async (event) => {
    console.log("Request event",event);
    let response;
    
    switch (true) {
        
        case event.httpMethod ==='POST' && event.path === subscribepath:
              const subscribebody = JSON.parse(event.body);
              response = subscribeservice.subscriber(subscribebody);
              break;

        case event.httpMethod ==='POST' && event.path === publishpath:
        const publishbody = JSON.parse(event.body);
        response = publishservice.publisher(publishbody);
                break;            
            default:
             response=util.buildResponse(404,'404 not found');
    }
    return response;
};

