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
import stylesUrl from "../styles/jokes.css";
import Header from "~/components/header";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl
    }
  ];
};

// TYPES
type LoaderData = {
  user: User | null;
  jokeListItems: Array<{ id: string; name: string }>;
};

// LOAD DATA
export const loader: LoaderFunction = async ({
  request
}) => {
  try {

    const jokeListItems = await db.joke.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true }
    });
    console.log(jokeListItems);
    const user = await getUser(request);
    if (!user) {
      console.log("User is not logged in.");
    }

    const data: LoaderData = {
      jokeListItems,
      user
    };  
    return data;
  }
  catch (ex) {
    console.log("Error getting jokes: ", ex.message);
    Promise.resolve(true);  
  }
return null;
};

export default function JokesRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="jokes-layout">
      <Header user={data?.user} />
      {/* <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link
              to="/"
              title="Remix Jokes"
              aria-label="Remix Jokes"
            >
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header> */}
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link prefetch="intent" to="all">All Jokes</Link>
            <br></br>
            <Link prefetch="intent" to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {data?.jokeListItems.map(joke => (
                <li key={joke.id}>
                  <Link prefetch="intent" to={joke.id}>{joke.name}</Link>
                </li>
              ))}
            </ul>
            <Link prefetch="intent" to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}


// ERROR BOUNDARY
export function ErrorBoundary({ error }: { error: Error }) {
  //const { jokeId } = useParams();
  console.log("ERROR_BOUNDARY in jokes.tsx ", error);
  return (
    <div className="error-container">{`There was an error loading jokes. Sorry.`}</div>
  );
}