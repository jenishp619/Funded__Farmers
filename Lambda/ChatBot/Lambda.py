import json
import boto3
import urllib3
import base64
client = boto3.client('dynamodb')
result = {}
intent=""
userid=""
dishid =""
quantity=""
res=""

def lambda_handler(event, context):
    intent=(event['sessionState']['intent']['name'])
    print('the intent is : ',intent)
    if intent=='greet':
        product=(event['sessionState']['intent']['slots']['product']['value']['originalValue'])
        offer(product)
        return result
    elif intent=='products':
        menu()
        return result
    
def offer(product):
        url="https://5ymgfbpllaza6ihfmbunjbl7kq0yfatn.lambda-url.us-east-1.on.aws/"
        data = {
                 "product_name":product
                }
        param = json.dumps(data)
        http = urllib3.PoolManager()
        res = http.request('POST', url, headers={'Content-Type': 'application/json'}, body=param)
        final = res.data.decode('utf-8')
        final = json.loads(final)
        price = final['price']
        offer = final['offer']
        message = "Offer for Product: "+str(product)+" is "+str(offer)+" and the final price is "+str(price)
        global result
        result ={
                 "messages": [
                  {
                  "content": message,
                  "contentType": "PlainText"
                  }
                 ],
                 "sessionState": {
                  "dialogAction": {
                  "type": "Close"
                  },
                  "intent": {
                  "name": "Greetings",
                  "state": "Fulfilled",
                  "confirmationState": "None"
                  }
                 }
                }
        return result

def menu():
    url="https://2pkl5nmznevwwo352to3sfa2zm0mekvs.lambda-url.us-east-1.on.aws/"
    http = urllib3.PoolManager()
    res = http.request('GET', url,headers={'Content-Type': 'application/json'})
    final = res.data.decode('utf-8')
    final = json.loads(final)
    final = final['products33']
    mes = {}
    for i in range(len(final)):
        mes[final[i]['product_name']['S']]=final[i]['price']['S']
    
    mes = json.dumps(mes)
    mes = mes.replace("{","").replace("}","")
    print(mes)    
    global result

    result ={
             "messages": [
              {
              "content": mes,
              "contentType": "PlainText"
              }
             ],
             "sessionState": {
              "dialogAction": {
              "type": "Close"
              },
              "intent": {
              "name": "foodmenu",
              "state": "Fulfilled",
              "confirmationState": "None"
              }
             }
            }
    return result