import { User } from "@prisma/client";
import { UploadHandler } from "@remix-run/node/formData";
import { ActionFunction, Form, Link, LinksFunction, LoaderFunction, Outlet, useLoaderData } from "remix";
import Header from "~/components/header";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import stylesUrl from "../styles/jokes.css";

import { unstable_parseMultipartFormData } from "remix";


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
        console.log("SERVER ----");

        let uploadHandler: UploadHandler = async ({
          name,
          stream
        }) => {
         console.log("Got here");

          if (name !== "avatar") {
            stream.resume();
            return;
          }
      
          const uploadedImage = { secure_url: "This is the best" }
            // await cloudinary.v2.uploader.upload(stream, {
            //   public_id: userId,
            //   folder: "/my-site/avatars"
            // });
            console.log(uploadedImage);
      
          return uploadedImage.secure_url;
        };


    let formData = await unstable_parseMultipartFormData(
        request,
        uploadHandler // <-- we'll look at this deeper next
      );

      let imageUrl = formData.get("avatar");

    //const data = new FormData("fileUploadForm");


    //var cloudinary = require('cloudinary').v2;
    // https://remix.run/docs/en/v1/api/remix#parsemultipartformdata-node

    return imageUrl;
  }


export default function ImagesRoute() {
  const data = useLoaderData<LoaderData>();
  console.log(data);
  return (    
      <div>
        <Header user={data?.user} />            
        <main className="container">   
            <h2>Images with Cloudinary</h2>     
            <form name="fileUploadForm" method="post" encType="multipart/form-data">
                <label>Select an Image</label>
                <input type="file" name="avatar"></input>
                <button type="submit">Upload</button>
            </form>
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
