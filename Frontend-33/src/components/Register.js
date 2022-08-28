import React, { useState } from 'react'
import { BrowserRouter,useNavigate } from "react-router-dom";
import axios from 'axios';
import constants from '../constants/constants';
import UserPool from './Userpool';
import { CognitoUserPool, CognitoUser, CognitoUserAttribute} from 'amazon-cognito-identity-js';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
const pool = {
    UserPoolId: 'us-east-1_HpJLrzzc3',
    ClientId: '4370577q63fusudtbgd8a16q3h'
  };
  const userpool = new AmazonCognitoIdentity.CognitoUserPool(pool);
export const Register = () => {

  let history = useNavigate();
  const [name,setName]=useState("");
  const [password,setPassword]=useState("");
  const [phone,setPhone]=useState("");
  const [email,setEmail]=useState("");




  const handleSubmit = event => {
    event.preventDefault();
   
     let phonedata ={
        Name : 'phone_number',
        Value : phone,
        Pool:userpool
     };

     let userData = {
        Username : email,
        Pool: UserPool
    };
    console.log("name here" + name)
    console.log("phone" + phone)
    console.log("email" + email)
   // const userAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(userData);
    const phoneAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(phonedata);
 
    userpool.signUp(email,password,[phoneAttribute],null, (err, data) => {
    if (err){ 
    console.error("error here" + err);
    alert(err)
    }
    console.log(data);
    if(data){
      const register_url = `${constants.API_BASE_URL}/register`
      console.log("register_url",register_url);
         axios.post(register_url,{
           name: name,
           email: email,
           phone_number: phone
         }).then((res)=>{
           console.log("res",res);
          history("/Confirmation?query="+email)
         }).catch((err)=>{
          console.log("err: ",err);
           alert("Technical error")
         })     
    }
  });

    
  console.log("email",email);
  console.log("password",password);
  
  }
  const validuser = (e) => {
    const user = e.target.value;

    setName(user);
    console.log(name)
  }
  const validpassword = (e) => {
    const pas = e.target.value;

    setPassword(pas);
    console.log(password)
  }
  const validphone = (e) =>{
    const Number = e.target.value;

    setPhone(Number);
    console.log(phone)
  }
  const validemail = (e) =>{
    const mail = e.target.value;

    setEmail(mail);
    console.log(email)
  }
  return (
    <div>
      <div className="container">
        
        <div className='row d-flex justify-content-center'>
          <div className='col-lg-5'>
            <div className='card'>
              <h1>Registration</h1>
              <form onSubmit={ handleSubmit }>
                <div>
                <label className='mt-2'>Name:  </label>
                <input required id='username' type='text' onChange={validuser }/>
                </div>
                <div>
                <label className='mt-4'>Password:  </label>
                <input required id='password' type='password' onChange={ validpassword }/>
                </div>
                <div>
                <label className='mt-4'>Phone Number:  </label>
                <input  type='text' onChange={ validphone }/>
                </div>
                <div>
                <label className='mt-4'>Email:  </label>
                <input required id='email' type='text' onChange={ validemail }/>
                </div>
                <button type='submit'>Sign up</button>
            </form>
              

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Register;

