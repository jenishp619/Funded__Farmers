import React, { Component } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import constants from "../constants/constants";
import {Login }from "./Login";

export const ProductDetails = () => {

    const [productDetails, setproductDetails] = useState([]);
    const param = useParams();
    console.log("Params:", param);
    var cust_id = localStorage.getItem("cust_id");
    console.log(cust_id);
   // const getAPI = `http://localhost:8080/get-product-details/${param.uuid}`;
    const getAPI = `${constants.API_BASE_URL}/get-product-details/${param.uuid}`



    useEffect(() => {
        console.log("in effect");
        axios.get(getAPI).then((res) => {
            console.log("In API");
            console.log("res", res);
            if (res && res.data && res.data.data) {
                console.log("In IF");
                console.log(res.data);
                setproductDetails(res.data.data);
                // console.log(Object.keys(listItems).length);
            }

        }).catch((err) => {
            console.log("Err", err);
        });
    }, [])
    const handleorder = (e) => {
        let email =cust_id;
        const article = {
         Subject: productDetails.product_description,
            Message: `Your order from  ${ productDetails.product_name}has been placed sucessfully for bill ${productDetails.price}` ,
          };
          console.log(article);
                axios
                  .post(
                    "https://4j76qduetg.execute-api.us-east-1.amazonaws.com/production-subscribe/publish",
                    article
                  )
                  .then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                      console.log("food ordered in google cloud");
                     
                      //window.location.href = "/getproducts";
                    }
                  })
                  .catch(function (error) {
                    alert("Error submitting feedback");
                    console.log("Exception occured");
                    console.log(error);
                  });
              };
    const handleSubmit = (e) => {
        let email =cust_id;
        console.log(email);
        const article = {
         Subject: productDetails.product_description,
            Message: `Your order from  ${ productDetails.product_name}has been placed sucessfully for bill ${productDetails.price}` ,
          };
          console.log(article);
        axios.post("https://4j76qduetg.execute-api.us-east-1.amazonaws.com/production-subscribe/subscribe", {
            email
        }).then(function (response) {
                    console.log(response);
                    if (response.status === 200) {
                      console.log("food ordered subscribe here");
                     // window.location.href = "/getproducts";
                    }
                  })
                  .catch(function (error) {
                    alert("Error submitting feedback");
                    console.log("Exception occured");
                    console.log(error);
                  });
              };
    return cust_id === null? <Login/>:(
        <div className="details-container">
            <div className="row justify-content-md-center">
                <div className="col-lg-7">
                    <img src={productDetails && productDetails.product_image_url} width="450" height="450"
                    ></img>
                </div>
                <div className="col-lg-5">
                    <div>
                        <h3>{productDetails && productDetails.product_name}</h3>
                    </div>
                    <div>
                        <h5>Description: {productDetails && productDetails.product_description}</h5>
                    </div>
                    <div>
                        <h5>Price: {productDetails && productDetails.price}</h5>
                    </div>
                  
                    <button onClick={handleSubmit}>Invoice</button>
                    <button onClick={handleorder}>Place order</button>
                    <div>

                    </div>

                </div>
            </div>
        </div>
    )


}
export default ProductDetails;

