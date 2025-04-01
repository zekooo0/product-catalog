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
          <div className="mt-2 ">
            <a
              href="/Comprehensive Guide To Affiliate Programs.pdf"
              download="Comprehensive Guide To Affiliate Programs.pdf"
              className="flex items-center justify-center gap-2 text-red-500 hover:underline break-words max-w-xs  border border-dashed p-2 border-red-500 rounded-md"
            >
              <div className="bg-red-500 rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </div>
              <span className="font-medium text-center">
                Free Comprehensive Guide To Affiliate Marketing
              </span>
            </a>
          </div>
        </div>
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
