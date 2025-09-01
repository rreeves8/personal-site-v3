"use client";

import { Rnd } from "react-rnd";
import { Tanks } from "../(tanks)/game";
import { create } from "zustand";
import { v4 } from "uuid";
import Image from "next/image";
import { useClickOutside, useHover } from "@/components/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Chess } from "../(chess)/chess";

type Window = { type: "tanks" | "chess"; id: string };

const useWindows = create<{
  windows: Array<Window>;
  addWindow: (w: Window["type"]) => void;
  removeWindow: (id: string) => void;
}>((set) => ({
  windows: [],
  addWindow: (type) =>
    set((state) => ({
      ...state,
      windows: [{ type, id: v4() }, ...state.windows],
    })),
  removeWindow: (_id) =>
    set((state) => ({
      ...state,
      windows: state.windows.filter(({ id }) => id !== _id),
    })),
}));

function Window({ children, id }: React.PropsWithChildren<{ id: string }>) {
  const rmW = useWindows((w) => w.removeWindow);

  return (
    <Rnd
      className="bg-white border-[3px] border-black shadow-[6px_6px_0_#000] font-black z-50"
      default={{
        x: 100,
        y: 100,
        width: 500,
        height: 500,
      }}
      dragHandleClassName="window-drag-handle"
      enableResizing={false}
    >
      <div className="flex flex-col h-full">
        <div className="window-drag-handle cursor-move flex items-center justify-between bg-[#8338EC] border-b-[3px] border-black px-2 py-1">
          <div className="flex gap-1">
            <button
              className="w-5 h-5 bg-[#EF476F] border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center text-xs hover:brightness-110"
              onClick={() => rmW(id)}
            >
              ×
            </button>
            <button className="w-5 h-5 bg-[#06D6A0] border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center text-xs hover:brightness-110">
              −
            </button>
            <button className="w-5 h-5 bg-[#FFD166] border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center text-xs hover:brightness-110">
              +
            </button>
          </div>
          <span className="text-sm select-none text-white">Tanks</span>
        </div>
        <div className="flex-1 bg-[#FFF5E1]">{children}</div>
      </div>
    </Rnd>
  );
}

function TopBar() {
  return (
    <div className="absolute w-full top-0 z-30 bg-[#3A86FF] border-b-[3px] border-black flex items-center justify-between p-2">
      {/* Left: Start + Quick Apps */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          <button className="h-8 px-3 bg-[#FFD166] border-2 border-black shadow-[2px_2px_0_#000] text-sm hover:brightness-110">
            Files
          </button>
          <button className="h-8 px-3 bg-[#06D6A0] border-2 border-black shadow-[2px_2px_0_#000] text-sm hover:brightness-110">
            Browser
          </button>
          <button className="h-8 px-3 bg-[#EF476F] border-2 border-black shadow-[2px_2px_0_#000] text-sm hover:brightness-110">
            Settings
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-8 px-3 bg-white border-2 border-black shadow-[2px_2px_0_#000] text-sm flex items-center">
          12:34
        </div>
        <div className="h-8 w-8 bg-[#8338EC] border-2 border-black shadow-[2px_2px_0_#000]" />
      </div>
    </div>
  );
}

function BottomBar() {
  return (
    <div className="absolute bottom-0 w-full z-30 bg-[#3A86FF] border-t-[3px] border-black flex justify-between p-2">
      <div className="flex items-center gap-2">
        <button className="h-8 px-3 bg-white border-2 border-black shadow-[2px_2px_0_#000] font-black text-sm hover:brightness-110">
          START
        </button>
        <div className="h-8 px-3 bg-white border-2 border-black shadow-[2px_2px_0_#000] text-sm flex items-center">
          Tanks
        </div>
        <div className="h-8 px-3 bg-white border-2 border-black shadow-[2px_2px_0_#000] text-sm flex items-center">
          Projects
        </div>
      </div>

      {/* Right: Clock + Status */}
      <div className="flex items-center gap-2 ml-auto">
        <div className="h-8 w-8 bg-[#8338EC] border-2 border-black shadow-[2px_2px_0_#000]" />
      </div>
    </div>
  );
}

function Item({ type }: { type: Window["type"] }) {
  const div = useRef<HTMLDivElement>(null);
  const hovering = useHover(div);

  const [clicked, setClicked] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const add = useWindows((w) => w.addWindow);

  const clickCount = useCallback(() => {
    if (!clicked) {
      setClicked(true);
      const id = setTimeout(() => setTimer(null), 500);
      setTimer(id);
    } else {
      setClicked(false);
      if (timer !== null) {
        add(type);
      }
    }
  }, [clicked, timer]);

  useClickOutside(
    div,
    useCallback(() => {
      if (clicked) {
        setClicked(false);
      }
    }, [clicked])
  );

  useEffect(() => {
    if (div.current) {
      div.current.addEventListener("click", clickCount);

      return () => {
        div.current?.removeEventListener("click", clickCount);
      };
    }
  }, [div.current, clickCount]);

  return (
    <div
      ref={div}
      className="flex flex-col items-center px-2 group cursor-pointer"
    >
      <div
        className={cn(
          "px-2 py-2 border-2 rounded-sm border-transparent",
          (hovering || clicked) && "border-black",
          clicked && "border-4"
        )}
      >
        {type === "tanks" ? (
          <Image alt="" src="/tank_icon.png" width={60} height={60} />
        ) : (
          <Image alt="" src="/chess_icon.png" width={65} height={65} />
        )}
      </div>

      <span
        className={cn(
          "mt-1 transition-colors w-full text-center",
          (hovering || clicked) && "bg-black text-white"
        )}
      >
        {type}
      </span>
    </div>
  );
}

export default function Projects() {
  const ws = useWindows((w) => w.windows);

  return (
    <div className="relative h-full bg-[#ffcc66] overflow-hidden">
      <TopBar />

      <div className="absolute left-0 z-10 flex flex-col gap-3 m-5 mt-16">
        <Item type="tanks" />
        <Item type="chess" />
      </div>

      <BottomBar />

      <div className="absolute inset-0 z-0 bg-[linear-gradient(#00000020_1px,transparent_1px),linear-gradient(90deg,#00000020_1px,transparent_1px)] bg-[length:20px_20px]" />

      {ws.map(({ id, type }) => (
        <Window id={id} key={id}>
          {type === "tanks" ? <Tanks /> : <Chess />}
        </Window>
      ))}
    </div>
  );
}
