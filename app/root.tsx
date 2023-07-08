import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import globalCssUrl from './styles/global.css'

export const links: LinksFunction = () => [
  { rel: "preload", as: "font", href: "/fonts/lato/lato-latin-300-normal.woff2", crossOrigin: "anonymous" },
  { rel: "preload", as: "font", href: "/fonts/lato/lato-latin-400-normal.woff2", crossOrigin: "anonymous" },
  { rel: "preload", as: "font", href: "/fonts/lato/lato-latin-700-normal.woff2", crossOrigin: "anonymous"},
  { rel: "stylesheet", href: globalCssUrl, as: "style" },
  { rel: "icon", href : "/images/favicon-64.webp", sizes: "64x64" },
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
