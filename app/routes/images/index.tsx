import { ActionFunction, Form, Link, LinksFunction, LoaderFunction, Outlet, useLoaderData } from "remix";
import stylesUrl from "../../styles/images.css";

export const links: LinksFunction = () => {
    return [
      {
        rel: "stylesheet",
        href: stylesUrl
      }
    ];
  };

// TYPES
//https://res.cloudinary.com/drvcbv6ec/image/upload/v1643121494/remix-jokes/fjaxnt9mxsl6ti4toiwt.jpg
//https://res.cloudinary.com/drvcbv6ec/image/upload/v1643121453/remix-jokes/c9vn11jcx2flsupvjtgd.jpg
type LoaderData = {
    imageList: Array<{ url: string; name: string; }>;    
};

export const loader: LoaderFunction = async ({
    request
  }) => {
    //console.log("In Loader Function: ", request);
          
    // const imageListItems = [
    //     {
    //         url: "https://res.cloudinary.com/drvcbv6ec/image/upload/v1643121494/remix-jokes/fjaxnt9mxsl6ti4toiwt.jpg", 
    //         name: "buckle"
    //     },
    //     {
    //         url: "https://res.cloudinary.com/drvcbv6ec/image/upload/v1643121453/remix-jokes/c9vn11jcx2flsupvjtgd.jpg", 
    //         name: "clasp"
    //     }    
    // ];

    //----------------------------------------------

    console.log("About to go to Cloudinary");

    const cloudinary = require('cloudinary').v2;
    const dotenv=require('dotenv');

    dotenv.config();

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    // var options = { resource_type:"image", folder:"remix-jokes", max_results: 5};
    // cloudinary.api.resources(options, function(error: any, res: any){
    //     if (error) {
    //         console.log(error);
    //     }
    //     debugger
    //     console.log("Got Results: ", res);
    //  });

    const imageListItems: any[] = [];
    
    let results = await cloudinary.search
        .expression('folder=remix-jokes')
        .execute()
        .then((result: any)=> {
            console.log(result);
            result.resources.map((item: { secure_url: any; public_id: any; }) => {
                imageListItems.push({
                    url: item.secure_url,
                    name: item.public_id
                })
            });
        }            
    );

    //----------------------------------------------


    //console.log("LoaderFunction(imageListItems): ", imageListItems);
      
    const data: LoaderData = { imageList: imageListItems };
    return data;
};
  

export default function ImageGallery() {
    console.log("...Render Image Gallery");
    
    const data = useLoaderData<LoaderData>();

    console.log("data: ", data?.imageList);
    let hasData = data?.imageList;

    return (
        <div>
            <h2>Image Gallery</h2>        
            <div className="images-layout">  
                {hasData ? (
                    data.imageList.map(image => (  

                        // Render the Image
                        <div key={image.url} className="image"
                            style={{backgroundImage: `url(${image.url})`}}
                        >                        
                            {/* <Link to={image.url}>
                                <img src={image.url} />
                            </Link> */}
                        </div>

                    ))
                ) : null}
            </div>         
        </div>
    );
}
