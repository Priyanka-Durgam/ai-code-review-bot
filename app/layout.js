import "./globals.css";

export const metadata = {
  title: "AI Code Review Bot",
  description: "A GitHub bot that automatically reviews your pull requests with AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
