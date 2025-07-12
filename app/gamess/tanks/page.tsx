"use client";

import { Spinner } from "@/components/ui/spinner";
import dynamic from "next/dynamic";

const Tanks = dynamic(() => import("./game"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center">
      <Spinner />
    </div>
  ),
});

export default function Page() {
  return (
    <div className="w-4/5 flex flex-1 justify-center mx-auto p-8">
      <Tanks />
    </div>
  );
}
