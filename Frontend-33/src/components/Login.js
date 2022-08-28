import React, { useState } from "react";
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { useNavigate, useSearchParams } from "react-router-dom";
import constants from "../constants/constants";
import Cookies from "js-cookie";

export const Login = () => {
  let history = useNavigate();

  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const poolData = {
    UserPoolId: "us-east-1_HpJLrzzc3",
    ClientId: "4370577q63fusudtbgd8a16q3h",
  };
  const UserPool = new CognitoUserPool({
    UserPoolId: "us-east-1_HpJLrzzc3",
    ClientId: "4370577q63fusudtbgd8a16q3h",
  });

  const validSubmit = (event) => {
    event.preventDefault();
    var cust_id = localStorage.setItem("cust_id", Email);
    console.log(cust_id);
    const user = new CognitoUser({
      Username: Email,
      Pool: UserPool,
    });
    const authDetails = new AuthenticationDetails({
      Username: Email,
      Password: Password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        console.log("onSuccess:", data);
        alert("hello you are successfully logged in");

        Cookies.set(constants.authorization_token, Email, { expires: 30 });
        if (data) {
          history("/getproducts");
        }
      },

      onFailure: (err) => {
        console.error("onFailure:", err);
        alert(err);
      },
    });
  };
  const validPassword = (e) => {
    const pas = e.target.value;

    setPassword(pas);
    console.log(Password);
  };
  const validEmail = (e) => {
    const mail = e.target.value;

    setEmail(mail);
    console.log(Email);
  };
  return (
    <>
      <div>
        <label className="mt-2">Email : </label>
        <input required type="text" onChange={validEmail} />
      </div>
      <div>
        <label className="mt-2">Password : </label>
        <input required type="password" onChange={validPassword} />
      </div>
      <button type="submit" onClick={validSubmit}>
        submit
      </button>
    </>
  );
};
