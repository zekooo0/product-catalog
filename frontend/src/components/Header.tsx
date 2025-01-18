"use client";
import Link from "next/link";
import AlphabetFilter from "./AlphabetFilter";
import Search from "./Search";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useAuth } from "@/contexts/auth-context";

const Header = ({
  selectedLetter,
  setSelectedLetter,
}: {
  selectedLetter: string;
  setSelectedLetter: (letter: string) => void;
}) => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="flex flex-col gap-5 p-5 sticky top-0 z-50 bg-background">
      <div className="flex items-center justify-between ">
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
          <Link href="/">Product Catalog</Link>
        </h1>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span>Welcome, {user?.name}</span>
              <Button onClick={logout}>Logout</Button>
            </div>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
      <div className=" flex flex-col items-center justify-between  gap-5">
        <Search />
        <AlphabetFilter
          setSelectedLetter={setSelectedLetter}
          selectedLetter={selectedLetter}
        />
      </div>
      <Separator />
    </div>
  );
};

export default Header;
