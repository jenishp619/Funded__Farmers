
import { CognitoUserPool, CognitoUser, CognitoUserAttribute} from 'amazon-cognito-identity-js';



const poolData = {
    UserPoolId: 'us-east-1_HpJLrzzc3',
    ClientId: '4370577q63fusudtbgd8a16q3h'
  };

  export default new CognitoUserPool(poolData);