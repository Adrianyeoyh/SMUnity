import {
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Chatbot } from "#client/components/chatbot/Chatbot";
import { Footer } from "#client/components/layout/footer";
import { Header } from "#client/components/layout/header";
import { Toaster } from "#client/components/ui/sonner";
import { MobileMenuProvider } from "#client/contexts/mobile-menu-context";

function RootComponent() {
  return (
    <MobileMenuProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <Chatbot />
        <Toaster />
        <TanStackRouterDevtools />
      </div>
    </MobileMenuProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
