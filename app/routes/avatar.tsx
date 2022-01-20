import { ActionFunction, redirect, Form } from "remix";

export let action: ActionFunction = async ({ request }) => {
    let formData = await parseMultipartFormData(
      request,
      uploadHandler // <-- we'll look at this deeper next
    );
  
    // the returned value for the file field is whatever our uploadHandler returns.
    // Let's imagine we're uploading the avatar to s3,
    // so our uploadHandler returns the URL.
    let avatarUrl = formData.get("avatar");
  
    // update the currently logged in user's avatar in our database
    await updateUserAvatar(request, avatarUrl);
  
    // success! Redirect to account page
    return redirect("/account");
  };
  
  export default function AvatarUploadRoute() {
    return (
      <Form method="post">
        <label htmlFor="avatar-input">Avatar</label>
        <input id="avatar-input" type="file" name="avatar" />
        <button>Upload</button>
      </Form>
    );
  }
