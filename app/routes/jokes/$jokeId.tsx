import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import { Link, useLoaderData, useCatch, redirect, useParams } from "remix";
import type { Joke as JokeModel } from "@prisma/client";
import { db } from "~/utils/db.server";
import { JokeDisplay }  from "~/components/joke";
import { getUserId, requireUserId } from "~/utils/session.server";

// SEO
export const meta: MetaFunction = ({
  data
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return {
      title: "No joke",
      description: "No joke found"
    };
  }
  return {
    title: `"${data.joke.name}" joke`,
    description: `Enjoy the "${data.joke.name}" joke and much more`
  };
};

// TYPES
type LoaderData = { joke: JokeModel, isOwner: boolean };

// LOAD DATA
// [Get the id from the URL and find in database]
export const loader: LoaderFunction = async ({
  request,
  params
}) => {
  const userId = await getUserId(request);

  const joke = await db.joke.findUnique({
    where: { id:params.jokeId }
  });
  if (!joke) throw new Response("What a joke!  Not found", { status: 404 });
  const data: LoaderData = { joke, isOwner: userId === joke.jokesterId };
  return data;
}

// POST DATA
export const action: ActionFunction = async ({
  request,
  params
}) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    console.log("Beginning Delete Logic");
    const userId = await requireUserId(request);
    const joke = await db.joke.findUnique({
      where: { id: params.jokeId }
    });
    if (!joke) {
      console.log("Joke not found.");
      throw new Response(
        "Can't delete what does not exist",
        { status: 404 }
      );
    }
    if (joke.jokesterId !== userId) {
      console.log("User did not create joke.");
      throw new Response(
        "Pssh, nice try. That's not your joke",
        {
          status: 401
        }
      );
    }
    console.log("Ending Delete Logic");
    await db.joke.delete({ where: { id: params.jokeId } });
    return redirect("/jokes");
  }
};


// HTML
export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();  

  return (
    <JokeDisplay joke={data.joke} isOwner={data.isOwner} />
  );
}

  //   return (
  //     <div>
  //     <p>Here's your hilarious joke:</p>
  //     <p>{data.joke.content}</p>
  //     <Link to=".">{data.joke.name} Permalink</Link>
  //     {data.isOwner ? (
  //       <form method="post">
  //         <input
  //           type="hidden"
  //           name="_method"
  //           value="delete"
  //         />
  //         <button type="submit" className="button">
  //           Delete
  //         </button>
  //       </form>
  //     ): null}
  //   </div>
  //   );
  // }


// CATCH BOUNDARY
export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  console.log("CATCH_BOUNDARY in $jokeId.tsx");
  switch (caught.status) {
    case 404: {
      return (
        <div className="error-container">
          Huh? What the heck is {params.jokeId}?
        </div>
      );
    }
    case 401: {
      return (
        <div className="error-container">
          Sorry, but {params.jokeId} is not your joke.
        </div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

// ERROR BOUNDARY
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  const { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  );
}