// import { User } from "@prisma/client";
import { User } from "@prisma/client";
import { Link } from "remix";
import stylesUrl from "../styles/jokes.css";

type UserProps = {
  user: User | null;
}

export default function({user}: UserProps) {
    return (
        <header className="jokes-header">
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
          {user ? (
            <div className="user-info">
              <span>{`Hi ${user?.username}`}</span>
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
      </header>
    );
}


// ERROR BOUNDARY
export function ErrorBoundary({ error }: { error: Error }) {
  //const { jokeId } = useParams();
  console.log("ERROR_BOUNDARY in header.tsx ", error);
  return (
    <div className="error-container">{`There was an error. Sorry.`}</div>
  );
}