import Providers from "./providers";
import "./globals.css";

export const metadata = {
  title: "Product Admin Dashboard",
  description: "A DummyJSON product admin dashboard built with Next.js, Tailwind CSS, and Axios.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
