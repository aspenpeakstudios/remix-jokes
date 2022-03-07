import { User } from "@prisma/client";
import { UploadHandler } from "@remix-run/node/formData";
import { ActionFunction, Form, Link, LinksFunction, LoaderFunction, Outlet, useLoaderData } from "remix";
import Header from "~/components/Header";
// import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import stylesUrl from "../styles/jokes.css";
import { unstable_parseMultipartFormData } from "remix";
// import streamifier from 'streamifier';
// import { UploadApiResponse } from 'cloudinary';
import { useState } from "react";
import ImageGallery from "~/routes/images";


export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl
    }
  ];
};

type LoaderData = {
  user: User | null;  
};

export const loader: LoaderFunction = async ({
  request
}) => {
    const user = await getUser(request);
    const data: LoaderData = { user };
    return data;
};


// SERVER POST
    // WTF:
    // https://github.com/remix-run/remix/pull/383#issuecomment-972373927
    // https://github.com/remix-run/remix/issues/1139
    // https://github.com/remix-run/remix/issues?q=is%3Aissue+is%3Aopen+parseMultipartFormData
    

    export let action: ActionFunction = async ({ request }) => {        
        //console.log("SERVER ----", request);

        let uploadHandler: UploadHandler = async ({
          name,
          stream
        }) => {
         //console.log("Got here: ", name, stream);

          if (name !== "avatar") {
            stream.resume();
            return;
          }
      
          console.log("About to go to Cloudinary");

          const cloudinary = require('cloudinary').v2;
          const dotenv=require('dotenv');

          dotenv.config();

          cloudinary.config({
              cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
              api_key: process.env.CLOUDINARY_API_KEY,
              api_secret: process.env.CLOUDINARY_API_SECRET
          })

          //https://support.cloudinary.com/hc/en-us/community/posts/360007581379-Correct-way-of-uploading-from-buffer-
          console.log("Try #: 6");
          console.log("Cloudinary initialized: ", process.env.CLOUDINARY_CLOUD_NAME);

          let uploadedImage = null;
          try {
            // uploadedImage =
            //   await cloudinary.uploader.upload_stream(stream, {
            //     // public_id: "drvcbv6ec",
            //     folder: "remix-jokes"
            // })
            // .catch((error:any) => {console.log("Caught error from upload: ", error);});
          }
          catch(e) {
            console.log("Error: ", e);
          };

          //require('~/utils/cloudinary');

          //const uploader = async (stream) => await cloudinary.uploads(stream, 'remix-jokes');
          // require('dotenv').config()

          //var cloudinary = require('cloudinary');
          //const options = { upload_preset: "fhew5n5e", cloud_name: 'drvcbv6ec', folder: "/remix-jokes" }

          // const uploadedImage = 
          // await cloudinary.uploader.upload(stream, 
          //   function(error: any, result: any) {console.log("result: ", result, "error: ", error)}
          // ).catch((error:any) => {
          //     console.log("Caught error from upload: ", error);
          // });
            
        //    // await cloudinary.v2.uploader.upload(stream, options);
           console.log("After Cloudinary: ", uploadedImage);
      
          return "null"; //uploadedImage.secure_url;
        };


    let imageUrl = null;
    try {
      let formData = await unstable_parseMultipartFormData(request, uploadHandler);
      imageUrl = formData.get("avatar");
      console.log("imageUrl: ", imageUrl);
    }
    catch(error) {
      console.log("Caught error from upload: ", error);
    }

    //const data = new FormData("fileUploadForm");

    //var cloudinary = require('cloudinary').v2;
    // https://remix.run/docs/en/v1/api/remix#parsemultipartformdata-node

    return imageUrl;
  }
 
  

export default function ImagesRoute() {
  const data = useLoaderData<LoaderData>();
  console.log(data);

  const [image, setImage ] = useState("");
  const [ url, setUrl ] = useState("");


  const setNewImage = (e: any) => {
    setImage(e.target.files[0]);
    console.log("SetNewImage: ", e.target.files[0]);
  }

const uploadImage = () => {  
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "fhew5n5e");
  data.append("cloud_name", "drvcbv6ec");
  // fetch("https://api.cloudinary.com/v1_1/drvcbv6ec/image/upload/q_auto,f_auto", {
  fetch("https://api.cloudinary.com/v1_1/drvcbv6ec/image/upload/", {
    method:"post",
    body:data
  })
  .then(resp => resp.json())
  .then(data => {
    setUrl(data.url);
    console.log(data.url);
  })
  .catch(err => console.log(err))

  //console.log("Data:", data, "Image: ", image);
}

  return (    
      <div>
        <Header user={data?.user} />            
        <main className="container">   
            <h2>Images with Cloudinary</h2>     
            {/* <form name="fileUploadForm" method="post" encType="multipart/form-data"> */}
                <label>Select an Image</label>
                <input type="file" name="avatar" onChange={setNewImage}></input>
                <button onClick={uploadImage}>Upload</button>
            {/* </form> */}
            <hr></hr>                        
            <Outlet />                          
        </main>
      </div>
    );
  }

  
// ERROR BOUNDARY
export function ErrorBoundary({ error }: { error: Error }) {
    
    //const { jokeId } = useParams();
    console.log("ERROR_BOUNDARY in images.tsx ", error);
    return (
      <div className="error-container">{`There was an error. Sorry.`}</div>
    );
  }
