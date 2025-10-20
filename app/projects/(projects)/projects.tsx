"use client";

import { Rnd } from "react-rnd";
import { Tanks } from "../(tanks)/game";
import { create } from "zustand";
import { v4 } from "uuid";
import Image from "next/image";
import { useHover } from "@/components/hooks";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Chess } from "../(chess)/chess";

type Window = { type: "tanks" | "chess"; id: string; active: boolean };

const useWindows = create<{
  windows: Array<Window>;
  setActive: (w: string) => void;
  addWindow: (w: Window["type"]) => void;
  removeWindow: (id: string) => void;
}>((set) => ({
  setActive: (id) =>
    set((s) => ({
      ...s,
      windows: s.windows.map((w) => {
        if (w.id === id) {
          w.active = true;
        } else {
          w.active = false;
        }
        return w;
      }),
    })),
  windows: [],
  addWindow: (type) =>
    set((state) => {
      if (!state.windows.find(({ type: t }) => type === t)) {
        return {
          ...state,
          windows: [
            { type, id: v4(), active: true },
            ...state.windows.map((w) => {
              w.active = false;
              return w;
            }),
          ],
        };
      }
      return state;
    }),
  removeWindow: (_id) =>
    set((state) => ({
      ...state,
      windows: state.windows.filter(({ id }) => id !== _id),
    })),
}));

const widths = {
  tanks: {
    width: 850,
    height: 475,
  },
  chess: {
    width: 500,
    height: 500,
  },
};

function WindowC({ id, type, active }: Window) {
  const rmW = useWindows((w) => w.removeWindow);
  const setActive = useWindows((w) => w.setActive);

  return (
    <Rnd
      className={cn(
        "bg-white border-[3px] border-black shadow-[6px_6px_0_#000] font-black",
        active ? "z-50" : "z-40"
      )}
      default={{
        x: 100,
        y: 100,
        ...widths[type],
      }}
      onMouseDown={() => setActive(id)}
      dragHandleClassName="window-drag-handle"
      enableResizing={false}>
      <div className="flex flex-col h-full">
        <div className="window-drag-handle cursor-move flex items-center justify-between bg-[#8338EC] border-b-[3px] border-black px-2 py-1">
          <div className="flex gap-1">
            <button
              className="w-5 h-5 bg-[#EF476F] border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center text-xs hover:brightness-110"
              onClick={() => rmW(id)}>
              ×
            </button>
          </div>
          <span className="text-sm select-none text-white">{type}</span>
        </div>
        <div className="flex-1 bg-[#FFF5E1]">
          {type === "tanks" ? <Tanks /> : <Chess />}
        </div>
      </div>
    </Rnd>
  );
}

function TopBar() {
  const [t] = useState(() => {
    const m = new Date().getMinutes();

    if (m.toString().length == 1) {
      return `0${m}`;
    }
    return m;
  });

  return (
    <div className="absolute w-full top-0 z-30 bg-[#3A86FF] border-b-[3px] border-black flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 px-3 bg-white border-2 border-black shadow-[2px_2px_0_#000] text-sm flex items-center">
          {new Date().getHours()}:{t}
        </div>
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
    </div>
  );
}

function Item({ type }: { type: Window["type"] }) {
  const div = useRef<HTMLDivElement>(null);
  const hovering = useHover(div);

  const add = useWindows((w) => w.addWindow);

  return (
    <div
      ref={div}
      className="flex flex-col items-center px-2 group cursor-pointer">
      <div
        onClick={() => add(type)}
        className={cn(
          "px-2 py-2 border-2 rounded-sm border-transparent",
          hovering && "border-4 border-black"
        )}>
        {type === "tanks" ? (
          <Image alt="" src="/tank_icon.png" width={60} height={60} />
        ) : (
          <Image alt="" src="/chess_icon.png" width={65} height={65} />
        )}
      </div>
      <span
        className={cn(
          "mt-1 transition-colors w-full text-center",
          hovering && "bg-black text-white"
        )}>
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
      {ws.map((w) => (
        <WindowC key={w.id} {...w} />
      ))}
    </div>
  );
}
