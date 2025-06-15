"use client";

import React, { PropsWithChildren, useEffect, useOptimistic } from "react";
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

export const Link = React.forwardRef(function Link(
  { href, children, replace, scroll, ...rest }: Parameters<typeof NextLink>[0],
  ref: React.Ref<HTMLAnchorElement>
) {
  const router = useRouter();

  const [loading, setLoading] = useOptimistic(false);

  useEffect(() => {
    if (!loading) {
      NProgress.done();
    } else {
      NProgress.start();
    }
  }, [loading]);

  return (
    <NextLink
      ref={ref}
      href={href}
      onClick={(e) => {
        if (isModifiedEvent(e)) return;
        e.preventDefault();
        startTransition(() => {
          setLoading(true);
          const url = typeof href === "string" ? href : formatUrl(href);
          if (replace) {
            router.replace(url, { scroll });
          } else {
            router.push(url, { scroll });
          }
        });
      }}
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
