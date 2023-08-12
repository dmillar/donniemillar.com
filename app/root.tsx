import { useEffect, useRef, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import globalCssUrl from "./styles/global.css";

export const links: LinksFunction = () => [
  {
    rel: "preload",
    as: "font",
    href: "/fonts/lato/lato-latin-300-normal.woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    href: "/fonts/lato/lato-latin-400-normal.woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    href: "/fonts/lato/lato-latin-700-normal.woff2",
    crossOrigin: "anonymous",
  },
  { rel: "stylesheet", href: globalCssUrl, as: "style" },
  { rel: "icon", href: "/images/favicon-64.webp", sizes: "64x64" },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorPage({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title></title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans">
        <main className="container items-center mx-auto py-20 px-2 max-w-2xl font-light">
          {children}
        </main>
      </body>
    </html>
  );
}

export function useTypingEffect(textToType: string, interKeyStrokeDurationInMs: number) : string {
  const [currentPosition, setCurrentPosition] = useState(0);
  const currentPositionRef = useRef(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPosition((value) => value + 1);
      currentPositionRef.current += 1;
      if (currentPositionRef.current > textToType.length) {
        clearInterval(intervalId);
      }
    }, interKeyStrokeDurationInMs);
    return () => {
      clearInterval(intervalId);
      currentPositionRef.current = 0;
      setCurrentPosition(0);
    };
  }, [interKeyStrokeDurationInMs, textToType]);

  return textToType.substring(0, currentPosition);
}

export function ErrorBoundary() {
  const error = useRouteError();
  const typingText = useTypingEffect("I'm sorry, Dave. I'm afraid I can't do that.", 75)
  
  if (isRouteErrorResponse(error)) {
    return (
      <ErrorPage>
        <Scripts/>
        <h1 className="font-bold text-3xl text-black">404</h1>
        <p className="font-mono ">{typingText}</p>
      </ErrorPage>
    );
  }
  
  let errorMessage = "Unknown error";

  if (isDefinitelyAnError(error)) {
    errorMessage = error.message;
  }

  return (
    <ErrorPage>
      <h1>Uh oh ...</h1>
      <p>Something went wrong.</p>
      <pre>{errorMessage}</pre>
    </ErrorPage>
  );
}
