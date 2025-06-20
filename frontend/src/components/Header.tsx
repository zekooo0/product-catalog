"use client";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import AlphabetFilter from "./AlphabetFilter";
import Guide from "./Guide";
import Search from "./Search";
import SocialIcons from "./SocialIcons";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

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
    <div className="flex flex-col gap-5 p-3 sm:p-5 sticky top-0 z-50 bg-background">
      {/* Header top section */}
      <div className="flex items-center justify-between gap-4 mb-4">
        {/* Logo section */}
        <h1 className="scroll-m-20 text-xl sm:text-2xl font-extrabold tracking-tight lg:text-3xl">
          <Link href="/" className="text-blue-500">
            AffiliateList.Site
          </Link>
        </h1>

        {/* Hamburger Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-6 pt-6">
              {/* Authentication */}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">Account</h3>
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <span>Welcome, {user?.name}</span>
                    <Button onClick={logout}>Logout</Button>
                  </div>
                ) : (
                  <Button asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                )}
              </div>

              {/* Theme Toggle */}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">Theme</h3>
                <ModeToggle />
              </div>

              {/* Comprehensive Guide */}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">Resources</h3>
                <Guide />
              </div>

              {/* Social Icons */}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">Follow Us</h3>
                <SocialIcons />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col items-center justify-between gap-3 sm:gap-5 w-full">
        <Search
          setSelectedLetter={setSelectedLetter}
          selectedLetter={selectedLetter}
          selectedCategory={selectedCategory}
        />
        <div className="w-full overflow-x-auto pb-2">
          <div className="min-w-max">
            <AlphabetFilter
              setSelectedLetter={setSelectedLetter}
              selectedLetter={selectedLetter}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default Header;
