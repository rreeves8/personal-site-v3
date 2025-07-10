"use client";

import dynamic from "next/dynamic";

const Tanks = dynamic(() => import("./game"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="w-4/5 flex flex-1 justify-center mx-auto p-8 border-2">
      <Tanks />
    </div>
  );
}
