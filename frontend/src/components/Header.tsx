"use client";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import AlphabetFilter from "./AlphabetFilter";
import { RainbowButton } from "./magicui/rainbow-button";
import Search from "./Search";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const Header = ({
  selectedLetter,
  setSelectedLetter,
  selectedCategory,
  setSelectedCategory,
}: {
  selectedLetter: string;
  setSelectedLetter: (letter: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}) => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="flex flex-col gap-5 p-5 sticky top-0 z-50 bg-background">
      <div className="flex items-start justify-between ">
        <div className="flex flex-col gap-2">
          <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
            <Link href="/" className="text-blue-500">
              AffiliateList.Site
            </Link>
          </h1>
        </div>
        <RainbowButton>Your #1 go to site for affiliate tools</RainbowButton>
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
        <Search
          setSelectedLetter={setSelectedLetter}
          selectedLetter={selectedLetter}
          selectedCategory={selectedCategory}
        />
        <AlphabetFilter
          setSelectedLetter={setSelectedLetter}
          selectedLetter={selectedLetter}
          setSelectedCategory={setSelectedCategory}
        />
      </div>
      <Separator />
    </div>
  );
};

export default Header;
