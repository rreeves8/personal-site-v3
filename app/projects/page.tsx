"use client";

import { Spinner } from "@/components/ui/spinner";
import dynamic from "next/dynamic";

const Projects = dynamic(() => import("./(projects)/projects"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center">
      <Spinner />
    </div>
  ),
});

export default function Page() {
  return (
    <div className="w-11/12 sm:w-4/5 mx-auto flex flex-col flex-1">
      <Projects />
    </div>
  );
}
