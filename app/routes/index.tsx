import { LinksFunction, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { Link } from "remix";
import stylesUrl from "../styles/index.css";
import imageStylesUrl from "../styles/images.css";
import AllJokesRoute from "./jokes/all";

// IMPORT STYLES
export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl
    },
    {
      rel: "stylesheet",
      href: imageStylesUrl
    }
  ];
};

type LoaderData = {
  imageList: Array<{ url: string; name: string; }>;    
};


export const loader: LoaderFunction = async ({
  request
}) => {
         
  const imageListItems = [
      {
          url: "https://res.cloudinary.com/drvcbv6ec/image/upload/v1643121494/remix-jokes/fjaxnt9mxsl6ti4toiwt.jpg", 
          name: "buckle"
      },
      {
          url: "https://res.cloudinary.com/drvcbv6ec/image/upload/v1643121453/remix-jokes/c9vn11jcx2flsupvjtgd.jpg", 
          name: "clasp"
      }    
  ];

  const data: LoaderData = { imageList: imageListItems };
  return data;
};


// SEO
export const meta: MetaFunction = () => {
  return {
    title: "Remix: So great, it's funny!",
    description:
      "Remix jokes app. Learn Remix and laugh at the same time!"
  };
};

// HTML
export default function Index() {
  const data = useLoaderData<LoaderData>();
  let hasData = data?.imageList != null && data?.imageList != undefined ;
  console.log(data, hasData);

  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Jokes!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="jokes">Read Jokes</Link>
            </li>
          </ul>
        </nav>

        {/* Try to throw some data in here */}
        <div>
            {/* <p>Image Gallery</p>   */}            
            <div className="images-layout">  
                {hasData ? (
                    data.imageList.map(image => (  

                        // Render the Image
                        <div key={image.url} className="image"
                            style={{backgroundImage: `url(${image.url})`}}
                        >                                                
                        </div>

                    ))
                ) : null}
            </div>         
        </div>
      </div>
    </div>
  );
}