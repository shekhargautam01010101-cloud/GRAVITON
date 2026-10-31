"use client";
import { Fragment, useEffect, useRef } from "react";
import { useStage } from "@/lib/stage";
import { LECTURE_TITLE, LECTURE_WORDS } from "@/lib/lecture";

export default function DocPane() {
  const { activeWord, setActiveWord } = useStage();
  const activeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeWord]);

  return (
    <section className="flex h-full min-h-[340px] flex-col rounded-2xl bg-[#f3efe4] p-8 text-slate-800 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] lg:[transform:perspective(1600px)_rotateY(3deg)]">
      <h2 className="font-serif text-3xl font-semibold tracking-tight">{LECTURE_TITLE}</h2>
      <p className="mt-1 text-sm text-slate-500">Words light up as the teacher reads them.</p>
      <div className="mt-6 flex-1 overflow-y-auto pr-2 font-serif text-2xl leading-[2.6rem]">
        {LECTURE_WORDS.map((w, i) => (
          <Fragment key={i}>
            {i === activeWord ? (
              <mark ref={activeRef} onClick={() => setActiveWord(i)}
                className="rounded-md bg-yellow-300 px-1 text-slate-900 shadow-[0_0_0_4px_rgba(253,224,71,0.35)] transition-all duration-200">
                {w}
              </mark>
            ) : (
              <span onClick={() => setActiveWord(i)}
                className={`cursor-pointer rounded-md px-1 transition-colors duration-300 ${i < activeWord ? "text-slate-400" : "text-slate-800"}`}>
                {w}
              </span>
            )}{" "}
          </Fragment>
        ))}
      </div>
    </section>
  );
}