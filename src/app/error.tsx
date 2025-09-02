"use client";

import { useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    toast.error("Došlo je do greške. Pokušajte ponovo.");
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold">Error, something went wrong!</h2>
      <p className="text-muted-foreground">
        {error.message || "Dogodila se neočekivana greška."}
      </p>
      <div className="flex gap-2">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Back to homepage
        </Button>
      </div>
    </div>
  );
}
