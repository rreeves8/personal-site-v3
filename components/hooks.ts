"use client";

import { RefObject, useEffect, useState } from "react";

export function useHover(div: RefObject<HTMLDivElement | null>) {
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (div.current) {
      const onHover = () => {
        setHovering(true);
      };
      const onHoverOut = () => {
        setHovering(false);
      };

      div.current.addEventListener("mouseover", onHover);
      div.current.addEventListener("mouseout", onHoverOut);

      return () => {
        div.current?.removeEventListener("mouseover", onHover);
        div.current?.removeEventListener("mouseout", onHoverOut);
      };
    }
  }, [div.current]);

  return hovering;
}

export function useClickOutside(
  ref: RefObject<HTMLDivElement | null>,
  cb: Function
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        cb();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, cb]);
}
