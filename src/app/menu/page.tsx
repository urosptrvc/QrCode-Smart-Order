import { Suspense } from "react";
import { Loading } from "@/src/components/ui/loading";
import MenuPage from "@/src/app/menu/components/MenuPage";

export default function MenuPageSuspenser() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <Loading size="lg" text="Loading Menu..." />
        </div>
      }
    >
      <MenuPage />
    </Suspense>
  );
}
