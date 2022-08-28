import json
import boto3
from botocore.exceptions import ClientError

dynamoClient = boto3.client('dynamodb')

def lambda_handler(event, context):

    try:
        product_name =[],
        price=[]
        response = dynamoClient.scan(TableName = 'products33')
        print(response)
        
        return (json.dumps({'statusCode': 200,
                'products33': response['Items'],
                'headers': {
                    'Content-Type': 'application/json'
                },
                'message': 'Menu list retrieved successfully!'}))
        
    except ClientError as err:
        return (json.dumps({'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'message': err.message}))
