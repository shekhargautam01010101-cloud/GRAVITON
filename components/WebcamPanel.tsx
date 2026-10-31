"use client";
import { RefObject, useEffect, useState } from "react";

// Member 2: attach MediaPipe to videoRef.current and draw landmarks on canvasRef.current.
export default function WebcamPanel({ videoRef, canvasRef }: {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}) {
  const [status, setStatus] = useState<"starting" | "live" | "blocked">("starting");

  useEffect(() => {
    let stream: MediaStream | undefined;
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480, facingMode: "user" }, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); }
        setStatus("live");
      })
      .catch(() => setStatus("blocked"));
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [videoRef]);

  return (
    <section className="relative h-full min-h-[180px] overflow-hidden rounded-2xl border border-white/10 bg-black">
      <video ref={videoRef} muted playsInline className="h-full w-full -scale-x-100 object-cover" />
      <canvas ref={canvasRef} width={640} height={480} className="absolute inset-0 h-full w-full -scale-x-100" />
      <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${status === "live" ? "bg-emerald-400 text-emerald-950" : "bg-slate-700 text-slate-100"}`}>
        {status === "live" ? "Camera on" : status === "blocked" ? "Allow camera access" : "Starting camera"}
      </span>
    </section>
  );
}