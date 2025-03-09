import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import Slider from "./components/slider";
import Provider from "./provider";
import Content from "./components/content";
import MenuButton from "./components/menuButton";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const getPoppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--poppins",
});
const getJosefinSans = Josefin_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--josef",
});
export const metadata = {
  title: "PsGaming",
  description: "PsGaming display all games all over the world with their trailers",
  icons: {
    icon: [
      {
        url: '/dashboardlogo.png'
      }
    ]
  }
};
export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} ${getPoppins.variable} ${getJosefinSans.variable} antialiased`}>
          <Provider>
            <div className="flex">
              <Slider />
              <Content>
                <MenuButton />
                {children}
              </Content>
            </div>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}