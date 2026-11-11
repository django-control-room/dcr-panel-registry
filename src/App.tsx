import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Toaster } from "@/components/ui/sonner";

import Home from "@/pages/Home";
import Wishlist from "@/pages/Wishlist";
import PanelDetail from "@/pages/PanelDetail";
import { panels } from "@/data/panels";
import NotFound from "@/pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <Toaster />
    </div>
  );
}

export const routes: RouteRecord[] = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/wishlist", element: <Wishlist /> },
      {
        path: "/:name",
        element: <PanelDetail />,
        // One prerendered HTML page per file in /panels.
        getStaticPaths: () => panels.map((panel) => `/${panel.name}`),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];
