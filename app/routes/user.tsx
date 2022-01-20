import { User } from "@prisma/client";
import {
  Link,
  LinksFunction,
  LoaderFunction,
  Outlet,
  useLoaderData
} from "remix";
import Header from "~/components/header";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import stylesUrl from "../styles/jokes.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl
    }
  ];
};

type LoaderData = {
  user: User;  
};

export const loader: LoaderFunction = async ({
  request
}) => {
    const user = await getUser(request);
    //if (!user) { user = undefined; }
    
  const data: LoaderData = { user };
  return data;
};


export default function AllJokesRoute() {
  const data = useLoaderData<LoaderData>();
  console.log(data);
  return (    
      <div>
        <Header user={data?.user} />    
        <main className="jokes-main">        
            <div className="jokes-outlet">
              <Outlet />
            </div>          
        </main>
      </div>
    );
  }