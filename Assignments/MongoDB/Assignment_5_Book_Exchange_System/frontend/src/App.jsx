import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#16231C",
            color: "#F1ECDD",
            borderRadius: "12px",
            fontFamily: "Public Sans, sans-serif",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#3F6B4F", secondary: "#F1ECDD" } },
          error: { iconTheme: { primary: "#9C4221", secondary: "#F1ECDD" } },
        }}
      />
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}
