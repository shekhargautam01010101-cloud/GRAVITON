"use client";
import { useRef, useState } from "react";
import { useStage } from "@/lib/stage";

function Pic({ url, alt }: { url: string; alt: string }) {
  const [ok, setOk] = useState(false); // remounted per url, so every new image gets its own reveal
  return (
    <>
      {!ok && <div className="skeleton absolute inset-0 rounded-2xl" />}
      <img src={url} alt={alt} draggable={false} onLoad={() => setOk(true)}
        className={`h-full w-full rounded-2xl object-cover ${ok ? "animate-enter" : "opacity-0"}`} />
    </>
  );
}

export default function ImageStage() {
  const { image, loading, zoom, rotX, rotY, setGesture, cursor } = useStage();
  const drag = useRef<{ x: number; y: number } | null>(null);

  return (
    <section
      className="relative h-full min-h-[300px] touch-none select-none overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] [perspective:1200px]"
      onWheel={(e) => setGesture({ zoom: zoom - e.deltaY * 0.001 })}
      onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        setGesture({ rotY: rotY + (e.clientX - drag.current.x) * 0.4, rotX: rotX - (e.clientY - drag.current.y) * 0.4 });
        drag.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => (drag.current = null)}
    >
      <div className="absolute inset-0 p-6">
        <div className="relative h-full w-full will-change-transform"
          style={{ transform: `scale(${zoom}) rotateX(${rotX}deg) rotateY(${rotY}deg)`, transition: "transform 120ms linear", transformStyle: "preserve-3d" }}>
          {image && <Pic key={image.url} url={image.url} alt={image.topic} />}
          {loading && <div className="skeleton absolute inset-0 rounded-2xl" />}
          {!image && !loading && (
            <div className="grid h-full place-items-center rounded-2xl border border-dashed border-white/15 text-center text-slate-400">
              <p>Start talking. The picture for your topic appears here.</p>
            </div>
          )}
        </div>
      </div>

      {image && (
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl bg-black/60 px-4 py-2 backdrop-blur">
          <p className="font-medium text-white">{image.topic}</p>
          {image.credit && <p className="text-xs text-slate-300">{image.credit}</p>}
        </div>
      )}

      {cursor.visible && (
        <div className="pointer-events-none absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-yellow-300 bg-yellow-300/30 transition-[left,top] duration-75"
          style={{ left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%` }} />
      )}
    </section>
  );
}