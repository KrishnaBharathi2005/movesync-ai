import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { BackgroundOrbs } from "@/components/BackgroundOrbs";
import { AuthScreens } from "@/components/AuthScreens";
import { Sidebar } from "@/components/Sidebar";
import { HomePage } from "@/components/pages/HomePage";
import { CapturePage } from "@/components/pages/CapturePage";
import { MusicPage } from "@/components/pages/MusicPage";
import { HistoryPage } from "@/components/pages/HistoryPage";
import { AccountPage } from "@/components/pages/AccountPage";

type Page = "home" | "capture" | "music" | "history" | "account";

const Index = () => {
  const { isAuthenticated, loading } = useApp();
  const [page, setPage] = useState<Page>("home");

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center relative">
        <BackgroundOrbs />
        <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin-custom" />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden relative">
      <BackgroundOrbs />

      {!isAuthenticated ? (
        <AuthScreens onAuthenticated={() => {}} />
      ) : (
        <div className="flex h-full">
          <Sidebar currentPage={page} onNavigate={setPage} />
          <main className="flex-1 overflow-y-auto p-8 relative">
            {page === "home" && <HomePage onNavigate={setPage} />}
            {page === "capture" && <CapturePage />}
            {page === "music" && <MusicPage />}
            {page === "history" && <HistoryPage />}
            {page === "account" && <AccountPage />}
          </main>
        </div>
      )}
    </div>
  );
};

export default Index;
