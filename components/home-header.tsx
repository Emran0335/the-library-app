import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import Logo from "./logo";
import Searchbar from "./SearchBar";

export default function Header() {
  return (
    <header className="container py-2 mx-auto p-2 lg:py-4">
      <div className="flex justify-between sm:hidden flex-col p-2">
        <div className="flex items-center">
          <Logo />
          <SidebarTrigger className="flex md:hidden ml-2" />
        </div>

        <Searchbar />
      </div>

      <div className="hidden sm:flex items-center justify-between">
        <Logo />

        <Searchbar />
      </div>
    </header>
  );
}
