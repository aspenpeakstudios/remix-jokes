import { ActionFunction, LoaderFunction, useTransition } from "remix";
import { useActionData, redirect, json, useCatch, Link, Form } from "remix";
import { db } from "~/utils/db.server";
import { requireUserId, getUserId } from "~/utils/session.server";
import { JokeDisplay } from "~/components/Joke";


// TYPES
type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  }
}
const badRequest = (data:ActionData) => json(data, { status: 400 });


// LOAD DATA
export const loader: LoaderFunction = async ({
  request
}) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return {};
};


// VALIDATION
function validateJokeContent(content: string) {
  if (content.length < 10) { return 'That joke is too short'; }
}
function validateJokeName(name: string) {
  if (name.length < 2) { return `That joke's name is too short`; }
}

// SERVER POST
export const action: ActionFunction = async ({
  request
}) => {
  // get user from session
  const userId = await requireUserId(request);

  // get the form fields  
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");

  // type checking
  if (
    typeof name !== "string" || 
    typeof content !== "string"
  ) {
    return badRequest({formError: `Form not submitted correctly.`});    
  }

  // assign the fields
  const fields = { name, content };

  // validate field rules
  const fieldErrors = { name: validateJokeName(name), content: validateJokeContent(content)};
  if (Object.values(fieldErrors).some(Boolean)) { return badRequest({ fieldErrors, fields })};
  
  const joke = await db.joke.create({ 
    data: { ...fields, jokesterId: userId }
  });
  console.log("new joke: ", joke);

  if (joke) {
    console.log("updating audit log");
    const auditLog = await db.auditLog.create({
      data: { author: userId, action: "New Joke", fileName: "routes/jokes/new.tsx", 
      message: `New Joke Created.  [name: ${name}], [content: ${content}]` }
    });
    console.log("audit log updated");
  }

  return redirect(`/jokes/${joke.id}`);
}

// HTML
export default function NewJokeRoute() {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();

  if (transition.submission) {    
    const name = transition.submission.formData.get("name");    
    const content = transition.submission.formData.get("content");

    if (typeof name === "string" && typeof content === "string" &&
    !validateJokeName(name) && !validateJokeContent(content)) {
      return (
        <JokeDisplay joke={{name, content }} isOwner={true} canDelete={false} />
      );
    }
  }

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <Form method="post">

        {/* NAME */}
        <div>            
          <label>
            Name: 
            <input 
              type="text" 
              name="name" 
              // for validation errors
              defaultValue={actionData?.fields?.name}
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-describedby={actionData?.fieldErrors?.name ? "name-error" : undefined}
            />
          </label>
          {/* Display error if validation error exists for this field */}
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" role="alert" id="name-error">{actionData.fieldErrors.name}</p>
          ): null}
        </div>

        {/* CONTENT */}
        <div>
          <label>
            Content: 
            <textarea 
              name="content" 
              // for validation errors
              defaultValue={actionData?.fields?.content}
              aria-invalid={Boolean(actionData?.fieldErrors?.content) || undefined}
              aria-describedby={actionData?.fieldErrors?.content ? "content-error" : undefined}
            />              
          </label>
          {/* Display error if validation error exists for this field */}
          {actionData?.fieldErrors?.content ? (
            <p className="form-validation-error" role="alert" id="content-error">{actionData.fieldErrors.content}</p>
          ) : null}
        </div>

        {/* SUBMIT */}
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>

      </Form>
    </div>
  );
}


// CATCH BOUNDARY
export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

// ERROR BOUNDARY
export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
} 
