import type { LoaderFunction } from "remix";
import { Link, useLoaderData } from "remix";
import type { Joke as JokeModel, User as UserModel } from "@prisma/client";
import { db } from "~/utils/db.server";
import Joke  from "../../components/Joke";
import formatDate from "~/utils/formatDate";

// TYPES
type LoaderData = { jokes: JokeModel[], user: UserModel };

// DATA
//  Get the id from the URL and find in database.
export const loader: LoaderFunction = async ({
  params
}) => {
  //console.log("params: ", params);
  const jokes = await db.joke.findMany({
    where: { jokesterId:params.jokesterId }
  });
  if (!jokes) throw new Error("Jokes not found");

  const user = await db.user.findUnique({
    where: {id: params.jokesterId}
  });
  if (!user) throw new Error("User not found");

  const data: LoaderData = { jokes, user };
  return data;
}

// HTML
export default function JokeRoute() {
  const data = useLoaderData<LoaderData>(); 
  console.log(data); 
    return (
      <div>
        <h2>All Jokes for {data.user.username}</h2>
        <hr></hr>
        <table>
            <thead>     
                <tr>
                    <th>Name</th>
                    <th>Joke</th>                    
                    <th>Date Entered</th>
                </tr>           
            </thead>
            <tbody>
                {data.jokes.map(joke => (
                    <tr key={joke.id}>
                        <td>{joke.name}</td> 
                        <td>{joke.content}</td>                         
                        <td>{formatDate(joke.createdAt)}</td>
                    </tr>           
                ))}
            </tbody>
         </table>        
      </div>
    );
  }