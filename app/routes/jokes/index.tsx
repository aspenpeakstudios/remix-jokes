import type { LoaderFunction } from "remix";
import { useLoaderData, Link } from "remix";
import type { Joke as JokeModel } from "@prisma/client";
import { db } from "~/utils/db.server";

// TYPES
type LoaderData = { randomJoke: JokeModel };

// DATA
export const loader: LoaderFunction = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber
  });
  const data: LoaderData = { randomJoke };
  return data;
}

// HTML
export default function JokesIndexRoute() {
    const data = useLoaderData<LoaderData>();

    return (
      <div>
        <p>Here's a random joke:</p>
        <p className="joke-text">{data.randomJoke.content}</p>
        <Link to={data.randomJoke.id}>
          "{data.randomJoke.name}" PermaLink
        </Link>
      </div>
    );
  }