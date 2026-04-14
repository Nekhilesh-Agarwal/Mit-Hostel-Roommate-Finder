import { useState } from "react";
import RegisterForm from "./components/RegisterForm";
import SearchRoom from "./components/SearchRoom";
import "./index.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("register");

  return (
    <div className="app">
      <header className="header">
        <div className="header-badge">🏠 Hostel Roommate Finder</div>
        <h1>Find Your Perfect Roommate</h1>
        <p>
          Register your room details or search to see who&apos;s already signed up.
          Fast, simple, real-time.
        </p>
      </header>

      <nav className="tabs" role="tablist">
        <button
          id="tab-register"
          className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
          onClick={() => setActiveTab("register")}
          role="tab"
          aria-selected={activeTab === "register"}
        >
          <span className="tab-icon">✏️</span> Add My Details
        </button>
        <button
          id="tab-search"
          className={`tab-btn ${activeTab === "search" ? "active" : ""}`}
          onClick={() => setActiveTab("search")}
          role="tab"
          aria-selected={activeTab === "search"}
        >
          <span className="tab-icon">🔍</span> Search a Room
        </button>
      </nav>

      {activeTab === "register" && <RegisterForm />}
      {activeTab === "search" && <SearchRoom />}

      <footer className="footer">
        Developed by Abhinav, Nekhilesh, Alden ❤️
      </footer>
    </div>
  );
}
