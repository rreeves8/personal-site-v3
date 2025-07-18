import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "nprogress/nprogress.css";
import { Button } from "@/components/ui/button";
import { Download, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LoadingProvider, Route } from "@/components/ui/link";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Magnus Reeves",
  description: "Personal site",
  icons: {
    icon: "https://gravatar.com/avatar/65a2b04d5bf09d66ab59ca5a1b3c52ee253530e87ee477f78f8b7779bd8814c9",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}
      >
        <LoadingProvider>
          <Nav />
          <div className="pt-14 flex-1 flex flex-col">
            {children}
            <footer className="w-4/5 border-t bg-background mx-auto py-4 mt-auto flex flex-row justify-between">
              <div className="flex flex-row gap-4">
                <Link
                  href="https://www.linkedin.com/in/magnus-reeves/"
                  target="_blank"
                  className="link"
                  aria-label="linkedin"
                >
                  <span className={`icon-[simple-icons--linkedin] size-6`} />
                </Link>
                <Link
                  href="https://github.com/rreeves8"
                  target="_blank"
                  className="link"
                  aria-label="GitHub"
                >
                  <span className={`icon-[simple-icons--github] size-6`} />
                </Link>
              </div>
              <div className="text-right">
                <p className=" font-bold">
                  {new Date().getFullYear()} Magnus Reeves
                </p>
                <p>Developed with NextJS</p>
                <p>
                  <Link
                    href="https://github.com/rreeves8/personal-site-v3"
                    target="_blank"
                    className=" text-blue-600"
                    aria-label="GitHub repository"
                  >
                    Source
                  </Link>
                </p>
              </div>
            </footer>
          </div>
        </LoadingProvider>
      </body>
    </html>
  );
}

const routes = ["experience", "personal", "games", "socials"];

function Nav() {
  return (
    <div className="fixed z-10 w-full flex items-center justify-center h-14 py-5 backdrop-blur-md">
      <div className="hidden lg:flex flex-row items-center justify-between basis-3/4">
        <div className="flex flex-row items-center justify-center gap-1">
          <Icon />
          <Route href="/">Magnus Reeves</Route>
          {routes.map((r) => (
            <Route key={r}>{r}</Route>
          ))}
        </div>
        <Resume />
      </div>

      <div className="flex lg:hidden flex-row justify-between items-center flex-1 px-7">
        <div className="flex flex-row items-center justify-center gap-1">
          <Icon />
          <Route href="/">Magnus Reeves</Route>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"secondary"} className="hover:cursor-pointer">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-3/5">
            <SheetHeader>
              <SheetTitle></SheetTitle>
            </SheetHeader>
            <div className="flex flex-col">
              {routes.map((r) => (
                <Route key={r}>{r}</Route>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function Resume() {
  return (
    <Button
      variant="ghost"
      className="text-xl font-normal tracking-tight"
      asChild
    >
      <a
        href="/Magnus_Resume.pdf"
        className="flex flex-row items-center gap-2"
        download="Magnus_Resume.pdf"
      >
        resume
        <Download />
      </a>
    </Button>
  );
}

function Icon() {
  return (
    <Avatar>
      <AvatarImage
        src="https://gravatar.com/avatar/65a2b04d5bf09d66ab59ca5a1b3c52ee253530e87ee477f78f8b7779bd8814c9"
        alt="@shadcn"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
