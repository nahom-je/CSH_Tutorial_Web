// src/App.jsx — Root Application with Page Routing
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar        from "./components/Navbar";
import Hero          from "./components/Hero";
import Benefits      from "./components/Benefits";
import Courses       from "./components/Courses";
import Pricing       from "./components/Pricing";
import HowItWorks    from "./components/HowItWorks";
import PaymentMethods from "./components/PaymentMethods";
import FAQ           from "./components/FAQ";
import Footer        from "./components/Footer";

// Quiz Pages
import QuizHome      from "./pages/QuizHome";
import QuizRunner    from "./pages/QuizRunner";

function LandingPage() {
  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: "absolute", left: "-9999px", top: "auto",
          width: "1px", height: "1px", overflow: "hidden",
        }}
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <Hero />
        <Benefits />
        <Courses />
        <Pricing />
        <HowItWorks />
        <PaymentMethods />
        <FAQ />
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/quizzes" element={<QuizHome />} />
      <Route path="/quiz/:chapterId" element={<QuizRunner />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
