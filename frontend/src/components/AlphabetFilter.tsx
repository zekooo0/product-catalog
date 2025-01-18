"use client";

import { Button } from "./ui/button";

export default function AlphabetFilter({
  selectedLetter,
  setSelectedLetter,
}: {
  selectedLetter: string;
  setSelectedLetter: (letter: string) => void;
}) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  console.log(selectedLetter);
  return (
    <div className="flex gap-1 overflow-x-scroll lg:overflow-x-hidden max-w-full  items-center">
      <Button
        className="btn"
        variant={selectedLetter === "" ? "outline" : "default"}
        onClick={() => setSelectedLetter("")}
        // disabled={selectedLetter === ""}
      >
        All
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
  );
}
