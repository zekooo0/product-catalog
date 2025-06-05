"use client";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import Link from "next/link";
import AlphabetFilter from "./AlphabetFilter";
import Guide from "./Guide";
import Search from "./Search";
import SocialIcons from "./SocialIcons";
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
      <div className="flex items-start justify-between gap-20 mb-10">
        <div className="flex flex-col gap-4">
          <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
            <Link href="/" className="text-blue-500">
              AffiliateList.Site
            </Link>
          </h1>
          <Guide />
        </div>
        <div className="relative h-full w-3/4 px-10">
          <Image
            src={"/banner.png"}
            fill
            className="object-cover"
            alt="banner"
          />
        </div>
        <div className="flex flex-col gap-4 items-end">
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
          <SocialIcons />
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
