import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { captureAndPersistTracking, startBehaviorTracking } from "../lib/tracking";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Formação Mecânico Automotivo" },
      { name: "description", content: "Formação online em mecânica automotiva, com aulas práticas e materiais de apoio." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Formação Mecânico Automotivo" },
      { property: "og:description", content: "Formação online em mecânica automotiva, com aulas práticas e materiais de apoio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // Non-render-blocking font load: starts as print-only and flips to "all"
      // via the inline script below as soon as it arrives, without holding first paint.
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap",
        media: "print",
        "data-font-swap": "true",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
    scripts: [
      {
        type: "text/javascript",
        children: `window.addEventListener('load',function(){var l=document.querySelector('link[data-font-swap]');if(l){l.media='all';}});`,
      },
      {
        type: "text/javascript",
        // Meta Pixel stub queues events immediately; the heavy fbevents.js only
        // downloads after the page has fully loaded, keeping first paint fast.
        children: `!function(f,b,e,v,n){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];}(window,document,'script');fbq('init','1414444593913961');fbq('track','PageView');function __loadFbe(){var t=document.createElement('script');t.async=!0;t.defer=!0;t.src='https://connect.facebook.net/en_US/fbevents.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(t,s);}if(document.readyState==='complete'){setTimeout(__loadFbe,2500);}else{window.addEventListener('load',function(){setTimeout(__loadFbe,2500);});}`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://www.facebook.com/tr?id=1414444593913961&ev=PageView&noscript=1"
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    // Fire-and-forget: page rendering never waits for tracking storage.
    captureAndPersistTracking();
    const stopBehaviorTracking = startBehaviorTracking();

    // The Meta Pixel may create/update _fbp/_fbc shortly after initialization.
    // Refresh and upsert the same tracking_id once more.
    // Pixel loading can be delayed on mobile. Reconcile genuine Meta cookies
    // without generating identifiers or creating additional conversion events.
    const refreshTimers = [2500, 7500, 15000].map((delay) =>
      window.setTimeout(() => {
        captureAndPersistTracking();
      }, delay),
    );
    const refreshOnVisible = () => {
      if (document.visibilityState === "visible") {
        captureAndPersistTracking();
      }
    };
    document.addEventListener("visibilitychange", refreshOnVisible);

    return () => {
      refreshTimers.forEach((timer) => window.clearTimeout(timer));
      document.removeEventListener("visibilitychange", refreshOnVisible);
      stopBehaviorTracking();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
