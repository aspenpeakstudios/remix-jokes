import type { LoaderFunction } from "remix";
import { useLoaderData, Link, useCatch } from "remix";
import type { Joke as JokeModel } from "@prisma/client";
import { db } from "~/utils/db.server";

// TYPES
type LoaderData = { randomJoke: JokeModel };

// DATA
export const loader: LoaderFunction = async () => {
try {
  const count = await db.joke.count();
  console.log("Number of jokes in database: ", count);
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber
  });
  if (!randomJoke) {
    throw new Response("No random joke found", {
      status: 404
    });
  }
  const data: LoaderData = { randomJoke };
  return data;
}
catch(ex) {
  console.log("Error in jokes/index.tsx", ex);
}
return null;

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

  
// CATCH BOUNDARY
export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        There are no jokes to display.
      </div>
    );
  }
  throw new Error(
    `Unexpected caught response with status: ${caught.status}`
  );
}

// ERROR BOUNDARY
export function ErrorBoundary() {
  return (
    <div className="error-container">
      I did a whoopsies.
    </div>
  );
}