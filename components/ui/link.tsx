"use client";

import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useOptimistic,
} from "react";
import { startTransition } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";
import { formatUrl } from "./format-url";
import { Button } from "./button";
import { cn } from "@/lib/utils";

NProgress.configure({
  showSpinner: false,
});

// Copied from  https://github.com/vercel/next.js/blob/canary/packages/next/src/client/link.tsx#L180-L191
function isModifiedEvent(event: React.MouseEvent): boolean {
  const eventTarget = event.currentTarget as HTMLAnchorElement | SVGAElement;
  const target = eventTarget.getAttribute("target");
  return (
    (target && target !== "_self") ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey || // triggers resource download
    (event.nativeEvent && event.nativeEvent.which === 2)
  );
}

type LoaderContextADT = {
  changeRoute: (
    href: Parameters<typeof NextLink>[0]["href"],
    scroll?: boolean,
    replace?: boolean
  ) => void;
};

export const LoaderContext = createContext<LoaderContextADT>(
  {} as LoaderContextADT
);

export function LoadingProvider({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const [loading, setLoading] = useOptimistic(false);

  useEffect(() => {
    if (!loading) {
      NProgress.done();
    } else {
      NProgress.start();
    }
  }, [loading]);

  const changeRoute = useCallback(
    (
      href: Parameters<typeof NextLink>[0]["href"],
      scroll = false,
      replace = false
    ) => {
      startTransition(() => {
        setLoading(true);
        const url = typeof href === "string" ? href : formatUrl(href);
        if (replace) {
          router.replace(url, { scroll });
        } else {
          router.push(url, { scroll });
        }
      });
    },
    []
  );

  return (
    <LoaderContext.Provider value={{ changeRoute }}>
      {children}
    </LoaderContext.Provider>
  );
}

export const Link = React.forwardRef(function Link(
  { href, children, replace, scroll, ...rest }: Parameters<typeof NextLink>[0],
  ref: React.Ref<HTMLAnchorElement>
) {
  const { changeRoute } = useContext(LoaderContext);

  return (
    <NextLink
      ref={ref}
      href={href}
      onClick={() => changeRoute(href, scroll, replace)}
      {...rest}
    >
      {children}
    </NextLink>
  );
});

export function Route({
  children,
  href,
}: PropsWithChildren<{ href?: string }>) {
  if (typeof children !== "string") {
    throw new Error("invalid child");
  }
  const url = href ? href : "/" + children;

  const isCurrent = usePathname() === url;

  return (
    <Button
      variant="ghost"
      className={cn(
        "text-xl font-normal tracking-tight",
        isCurrent && " font-bold"
      )}
      asChild
    >
      <Link href={url}>{children}</Link>
    </Button>
  );
}
