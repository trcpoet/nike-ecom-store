import { ReactNode } from "react";
import { Footer, Navbar } from "@/components";

export default function RootGroupLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
