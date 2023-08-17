import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Provider from "./Provider";
import Header from "../components/sections/Header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rotina Monetária",
  description:
    "Um planejador financeiro de uso pessoal para a gestão de suas finanças",
  icons: "./favicon.svg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Provider>
        <body className={`${poppins.className} container mx-auto flex-col`}>
          <div className="min-h-screen flex-grow">
            <Header />
            {children}
          </div>
        </body>
      </Provider>
    </html>
  );
}
