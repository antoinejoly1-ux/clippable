"use client";

import { useEffect } from "react";

/** Sign-up stays light whichever side of the site the visitor came from. */
export function LightOnly() {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.dataset.audience;
    delete root.dataset.audience;
    return () => {
      if (prev) root.dataset.audience = prev;
    };
  }, []);
  return null;
}
