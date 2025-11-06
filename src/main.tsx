import { StrictMode } from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import "./globals.css";

import { NuqsProvider } from "./providers/nuqs";
import { ReactQueryProvider } from "./providers/react-query";
import { LenisProvider } from "./providers/lenis";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const x = 1;

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <LenisProvider>
      <ReactQueryProvider>
        <NuqsProvider>
          <RouterProvider router={router} />
        </NuqsProvider>
      </ReactQueryProvider>
      </LenisProvider>
    </StrictMode>,
  );
}
