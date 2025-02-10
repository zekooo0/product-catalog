'use client';

import { useLayoutEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, ListOrdered, LayoutGrid } from "lucide-react";

const FirstTimeModal = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setIsOpen(true);
      // localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        localStorage.setItem('hasVisitedBefore', 'true');
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">How to use this app</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
              <Search className="h-6 w-6 text-pink-500" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-semibold">Quick Search</h4>
              <p className="text-sm text-muted-foreground">
                Find tools instantly using keywords
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
              <ListOrdered className="h-6 w-6 text-pink-500" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-semibold">A-Z Navigation</h4>
              <p className="text-sm text-muted-foreground">
                Browse alphabetically for easy access by Tool
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
              <LayoutGrid className="h-6 w-6 text-pink-500" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-semibold">Categories</h4>
              <p className="text-sm text-muted-foreground">
                Explore tools by category type
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            variant="default"
            onClick={() => setIsOpen(false)}
            className="bg-pink-500 hover:bg-pink-600"
          >
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FirstTimeModal;
