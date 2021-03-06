import { LinksFunction, LoaderFunction, MetaFunction, redirect } from "remix";
import { Links, LiveReload, Outlet, useCatch, Meta, Scripts } from "remix";

import globalStylesUrl from "./styles/global.css";
import globalMediumStylesUrl from "./styles/global-medium.css";
import globalLargeStylesUrl from "./styles/global-large.css";

// IMPORT STYLES
export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalStylesUrl
    },
    {
      rel: "stylesheet",
      href: globalMediumStylesUrl,
      media: "print, (min-width: 640px)"
    },
    {
      rel: "stylesheet",
      href: globalLargeStylesUrl,
      media: "screen and (min-width: 1024px)"
    }
  ];
};

// LOADER
// export let loader: LoaderFunction = ({ request }) => {
//   // upgrade people to https automatically

//   let url = new URL(request.url);
//   let hostname = url.hostname;
//   let proto = request.headers.get("X-Forwarded-Proto") ?? url.protocol;

//   url.host =
//     request.headers.get("X-Forwarded-Host") ??
//     request.headers.get("host") ??
//     url.host;
//   url.protocol = "https:";

//   if (proto === "http" && hostname !== "localhost") {
//     return redirect(url.toString(), {
//       headers: {
//         "X-Forwarded-Proto": "https",
//       },
//     });
//   }
//   return {};
// };


// SEO
export const meta: MetaFunction = () => {
  const description = `Learn Remix and laugh at the same time!`;
  return {
    description,
    keywords: "Remix,jokes",
    "twitter:image": "https://remix-jokes.lol/social.png",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@remix_run",
    "twitter:site": "@remix_run",
    "twitter:title": "Remix Jokes",
    "twitter:description": description
  };
};

// PAGE
function Document({
  children,
  title = `Remix: So great, it's funny!`
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>        
        {children}       
        <Scripts />
        {process.env.NODE_ENV === "development" ? (
          <LiveReload />
        ) : null}
      </body>
    </html>
  );
}

// HTML
export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

// CATCH BOUNDARY
export function CatchBoundary() {
  const caught = useCatch();  
  console.log("CATCH_BOUNDARY in root.tsx");

  return (
    <Document
      title={`${caught.status} ${caught.statusText}`}
    >
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}

// ERROR BOUNDARY
export function ErrorBoundary({ error }: { error: Error }) {
  console.log("ERROR_BOUNDARY in root.tsx: ", error);

  return (
    <Document title="Uh-oh!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}