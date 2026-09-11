import type { Metadata } from "next";
import Navigation from "@/components/navigation";
import "./globals.css";
export const metadata: Metadata = {
  title: "Growth Mentor — Your weekly practice",
  description:
    "Connect your ten-year vision to the progress you make each week.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="workspace">{children}</main>
      </body>
    </html>
  );
}
