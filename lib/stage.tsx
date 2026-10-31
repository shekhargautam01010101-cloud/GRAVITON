"use client";
// Shared state for the whole screen. Members 2, 3 and 4 only call these functions.
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type StageImage = { url: string; topic: string; credit?: string };
type Cursor = { x: number; y: number; visible: boolean }; // x,y are 0..1 over the image stage

type Stage = {
  activeWord: number; setActiveWord: (i: number) => void;     // -1 = nothing spoken yet
  image: StageImage | null; showImage: (img: StageImage) => void;
  loading: boolean; setLoading: (b: boolean) => void;        // true while /api/analyze-speech is running
  zoom: number; rotX: number; rotY: number;
  setGesture: (g: { zoom?: number; rotX?: number; rotY?: number }) => void;
  resetView: () => void;
  cursor: Cursor; setCursor: (c: Cursor) => void;            // MediaPipe index finger goes here
};

const Ctx = createContext<Stage | null>(null);
export const useStage = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStage must be used inside StageProvider");
  return c;
};

export function StageProvider({ children }: { children: ReactNode }) {
  const [activeWord, setActiveWord] = useState(-1);
  const [image, setImage] = useState<StageImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState({ zoom: 1, rotX: 0, rotY: 0 });
  const [cursor, setCursor] = useState<Cursor>({ x: 0.5, y: 0.5, visible: false });

  const showImage = useCallback((img: StageImage) => { setImage(img); setLoading(false); }, []);
  const setGesture = useCallback((g: { zoom?: number; rotX?: number; rotY?: number }) =>
    setView((v) => ({
      zoom: Math.min(3, Math.max(0.5, g.zoom ?? v.zoom)),
      rotX: Math.min(45, Math.max(-45, g.rotX ?? v.rotX)),
      rotY: g.rotY ?? v.rotY,
    })), []);
  const resetView = useCallback(() => setView({ zoom: 1, rotX: 0, rotY: 0 }), []);

  return (
    <Ctx.Provider value={{ activeWord, setActiveWord, image, showImage, loading, setLoading,
      ...view, setGesture, resetView, cursor, setCursor }}>
      {children}
    </Ctx.Provider>
  );
}