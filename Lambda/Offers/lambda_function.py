import json
import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    try:
        offer=[]
        price=[]
        
        
        body = event['body']
        print(type(body))
        body = json.loads(body)
        body=body['product_name']
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('offer')      
        resp = table.query(
            KeyConditionExpression=Key('product_name').eq(str(body))
        )
        data = resp['Items'][0]
        print(data)
        price = data['final_price']
        offer = data['offer_p']
        
        return {
            'statusCode': 200,
            'body':{
                'offer':offer,
                'price':price
            }
        }
    except Exception as e:
        print(e)
        return { 
            'statusCode':500, 
            'body': 'Internal server error'
            }
