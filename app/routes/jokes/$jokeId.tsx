import type { LoaderFunction } from "remix";
import { Link, useLoaderData } from "remix";
import type { Joke as JokeModel } from "@prisma/client";
import { db } from "~/utils/db.server";
import Joke  from "../../components/Joke";

// TYPES
type LoaderData = { joke: JokeModel };

// DATA
//  Get the id from the URL and find in database.
export const loader: LoaderFunction = async ({
  params
}) => {
  console.log("params: ", params);
  const joke = await db.joke.findUnique({
    where: { id:params.jokeId }
  });
  if (!joke) throw new Error("Joke not found");
  const data: LoaderData = { joke };
  return data;
}

// HTML
export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();  
    return (
      <div>
        <p>Here's your hilarious joke:</p>
        <p className="joke-text">{data.joke.content}</p>
        {/* <Joke words={data.joke.content} /> */}
        <Link to=".">"{data.joke.name}" Permalink</Link>
      </div>
    );
  }