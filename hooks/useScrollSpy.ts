"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently in view.
 *
 * Uses a scroll-position strategy that picks the section whose top
 * has been most recently passed by the viewport's "active" line
 * (`scrollY + offset`). This is robust for tall sections — unlike an
 * IntersectionObserver-by-ratio approach, where a tall section like
 * "Experience" can lose to shorter neighbouring sections even when
 * the user has clearly scrolled into it.
 */
export function useScrollSpy(ids: string[], offset = 96): string {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;

    const compute = () => {
      const elements = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el));
      if (elements.length === 0) return;

      // The active "line" sits a few px below the navbar so a section
      // becomes active as soon as its top crosses the navbar.
      const activeLine = window.scrollY + offset + 4;

      let current = elements[0].id;
      for (const el of elements) {
        if (el.offsetTop <= activeLine) {
          current = el.id;
        } else {
          break;
        }
      }

      // If the user has scrolled to (or near) the bottom of the page,
      // force the last section to be active — useful when the last
      // section is shorter than the viewport.
      const bottomReached =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (bottomReached) {
        current = elements[elements.length - 1].id;
      }

      setActiveId((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return activeId;
}
