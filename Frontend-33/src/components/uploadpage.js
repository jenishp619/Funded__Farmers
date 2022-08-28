import axios from 'axios';
import React, { Fragment, useState } from 'react';
import constants from "../constants/constants";
import {Login }from "./Login";
const FileUpload = () => {
  var cust_id = localStorage.getItem("cust_id");
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const onChange = e => {
    console.log(e.target.files);
    setFiles(e.target.files)
  };
  //console.log(files);
  const onSubmit = async e => {
    e.preventDefault();
   
    const formData = new FormData();
    Object.values(files).forEach(file=>{
      formData.append("photo", file);
    });
        formData.append('price', price);
        formData.append('product_name', name);
        formData.append('product_description', description);
       let data ={
           'photo':files,
           "price": price,
           "product_name": name,
           "description": description
       }
       console.log(formData);
    try {
      const postAPI = `${constants.API_BASE_URL}/addproduct`;
      const res = await axios.post(postAPI, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log(res);
    } catch (err) {
      if (err.response.status === 500) {
        console.log(err);
      } else {
        console.log("inside");
      }
    }
  };

  return cust_id === null? <Login/>:(
    <Fragment>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type='file'
            id='file'
            name="photo"
            multiple
            onChange={onChange}
          />
             <input
                    type="text"
                    value={name}
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    value={description}
                    placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="text"
                    value={price}
                    placeholder="Price"
                    onChange={(e) => setPrice(e.target.value)}
                />
        </div>
        <button type='submit'>Upload</button>
      </form>
    </Fragment>
  );
};

export default FileUpload;