import Footer from "@/components/home-footer";
import Header from "@/components/home-header";
import Navbar from "@/components/home-navbar";
import React from "react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-screen justify-between">
      <div className="w-full h-full">
        <Header />
        <Navbar />
        <div className="p-2">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
