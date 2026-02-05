import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oracle Evolution X",
  description: "AI Market Intelligence Engine — Find profitable niches before they trend."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">

      <body className="bg-black text-white antialiased">

        {/* Background glow (elite aesthetic) */}
        <div className="fixed inset-0 -z-10">

          <div className="absolute inset-0 bg-black" />

          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[160px] rounded-full" />

        </div>

        {/* Main app */}
        <div className="relative z-10">

          {children}

        </div>

      </body>

    </html>
  );
}