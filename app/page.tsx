"use client";
import { useEffect, useRef, useState } from "react";
import { StageProvider, useStage } from "@/lib/stage";
import { LECTURE_WORDS } from "@/lib/lecture";
import DocPane from "@/components/DocPane";
import ImageStage from "@/components/ImageStage";
import WebcamPanel from "@/components/WebcamPanel";

// Demo: plays a fake lecture so the UI works before speech/gesture/API are connected.
function Controls() {
  const stage = useStage();
  const ref = useRef(stage); ref.current = stage;
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    let i = -1;
    ref.current.resetView();
    const t = setInterval(() => {
      i++;
      const s = ref.current;
      if (i === 1) { s.setLoading(true); setTimeout(() => ref.current.showImage({ url: "https://picsum.photos/seed/heart/1000/700", topic: "Human heart", credit: "Demo image" }), 900); }
      if (i === 17) { s.setLoading(true); setTimeout(() => ref.current.showImage({ url: "https://picsum.photos/seed/atria/1000/700", topic: "Atria and ventricles", credit: "Demo image" }), 900); }
      s.setActiveWord(i);
      if (i >= LECTURE_WORDS.length - 1) { clearInterval(t); setRunning(false); }
    }, 300);
    return () => clearInterval(t);
  }, [running]);

  const btn = "rounded-xl px-4 py-2 text-sm font-medium transition-colors";
  return (
    <div className="flex h-full flex-wrap content-center items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <button onClick={() => setRunning((r) => !r)} className={`${btn} bg-yellow-300 text-slate-900 hover:bg-yellow-200`}>
        {running ? "Stop demo" : "Play demo lecture"}
      </button>
      <button onClick={stage.resetView} className={`${btn} bg-white/10 text-white hover:bg-white/20`}>Reset view</button>
      <p className="w-full text-sm text-slate-400">Scroll to zoom, drag to rotate. Zoom is {stage.zoom.toFixed(1)}x.</p>
    </div>
  );
}

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return (
    <StageProvider>
      <main className="bg-space min-h-screen p-4 text-white lg:h-screen">
        <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-4">
          <header className="flex items-baseline justify-between px-2">
            <h1 className="text-2xl font-semibold tracking-tight">Graviton Classroom Assistant</h1>
            <p className="text-sm text-slate-400">Speak, point, and the lesson comes to life.</p>
          </header>
          <div className="grid flex-1 grid-cols-1 gap-4 lg:min-h-0 lg:grid-cols-12">
            <div className="lg:col-span-5 lg:min-h-0"><DocPane /></div>
            <div className="grid gap-4 lg:col-span-7 lg:min-h-0 lg:grid-rows-[1fr_220px]">
              <ImageStage />
              <div className="grid gap-4 sm:grid-cols-2">
                <WebcamPanel videoRef={videoRef} canvasRef={canvasRef} />
                <Controls />
              </div>
            </div>
          </div>
        </div>
      </main>
    </StageProvider>
  );
}