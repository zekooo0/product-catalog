"use client";

import { Button } from "./ui/button";

export default function AlphabetFilter({
  selectedLetter,
  setSelectedLetter,
  setSelectedCategory,
}: {
  selectedLetter: string;
  setSelectedLetter: (letter: string) => void;
  setSelectedCategory: (category: string | null) => void;
}) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-max flex justify-center">
        <div className="flex gap-1 overflow-x-scroll lg:overflow-x-hidden max-w-full items-center">
          <Button
            className="btn"
            variant={selectedLetter === "" ? "outline" : "default"}
            onClick={() => {
              setSelectedLetter("");
              setSelectedCategory(null);
            }}
          >
            All Tools
          </Button>

          {letters.map((letter) => (
            <Button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className="btn px-3 xl:px-4"
              variant={selectedLetter === letter ? "ghost" : "secondary"}
              disabled={selectedLetter === letter}
            >
              {letter}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
