import { User } from "@prisma/client";
import {
  Link,
  LinksFunction,
  LoaderFunction,
  Outlet,
  useLoaderData
} from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import stylesUrl from "../../styles/jokes.css";

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
  jokeListItems: Array<{ id: string; name: string, content: string, createdAt: Date, username: string }>;
};

export const loader: LoaderFunction = async ({
  request
}) => {

  //https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries

  const jokeListItems = await db.joke.findMany({    
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, content: true, createdAt: true,
        jokester: {
            select: { 
                id: true,
                username: true
            }
        } 
    }
  });
  console.log("jokeListItems: ", jokeListItems);
  const user = await getUser(request);

  const data: LoaderData = {
    jokeListItems,
    user
  };
  return data;
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US");
}

export default function AllJokesRoute() {
  const data = useLoaderData<LoaderData>();
  console.log("data: ", data.jokeListItems);

  return (    
    <div>            
        <h2>All Jokes in the database</h2>
        <hr></hr>
        <table>
            <thead>     
                <tr>
                    <th>Name</th>
                    <th>Joke</th>
                    <th>User</th>
                    <th>Date Entered</th>
                </tr>           
            </thead>
            <tbody>
                {data.jokeListItems.map(joke => (                    
                    <tr key={joke.id}>
                        <td>{joke.name}</td> 
                        <td>{joke.content}</td> 
                        <td><Link to={"/user/" + joke.jokester.id}>{joke.jokester.username}</Link></td> 
                        <td>{formatDate(joke.createdAt)}</td>
                    </tr>           
                ))}
            </tbody>
         </table>
    </div>  
  );
}