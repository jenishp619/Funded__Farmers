import React, { components } from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import constants from "../constants/constants";
import { Login } from "./Login";

export const ProductListing = () => {
  const [listItems, setListItems] = useState([]);
  //const getAPI = "http://localhost:8080/getproducts";
  const getAPI = `${constants.API_BASE_URL}/getproducts`;

  var cust_id = localStorage.getItem("cust_id");
  console.log(cust_id);
  useEffect(() => {
    axios.get(getAPI).then((res) => {
      if (res && res.data && res.data.products) {
        setListItems(res.data.products);
      }
    });
  }, []);

  return cust_id === null ? (
    <Login />
  ) : (
    <div className="container product-container">
      <div className="row product-row">
        <h1>All Listings</h1>
        {listItems.map((r) => {
          let url = "/get-product-details/" + r.id;
          return (
            <div className="col-lg-3 border-20-px">
              <a href={url}>
                <div class="product-card" style={{ float: "left" }}>
                  <img
                    src={`${r.product_image_url}`}
                    width="180"
                    height="180"
                    alt="product"
                  />
                  <div class="product-card-body">
                    <h5 class="wishlist-card-title">{r.product_name}</h5>
                  </div>
                  <ul class="list-group list-group-flush">
                    <h4 class="list-group-item">{r.product_description}</h4>
                  </ul>
                  <ul class="list-group list-group-flush">
                    <h4 class="list-group-item">CAD: {r.price}</h4>
                  </ul>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductListing;
