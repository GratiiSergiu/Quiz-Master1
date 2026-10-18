import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  ReactDOM.createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} catch (error) {
  console.error("Failed to initialize app:", error);
  // Fallback error display
  document.body.innerHTML = `
    <div style="min-height: 100vh; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; padding: 2rem; font-family: system-ui;">
      <div style="max-width: 500px; text-align: center;">
        <h1 style="color: #f87171; margin-bottom: 1rem;">Eroare la încărcarea aplicației</h1>
        <p style="color: #94a3b8; margin-bottom: 1.5rem;">
          Aplicația nu a putut porni. Încearcă să ștergi datele salvate în browser sau să folosești un alt browser.
        </p>
        <button onclick="localStorage.clear(); window.location.reload();" style="padding: 0.75rem 1.5rem; background: #6366f1; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem;">
          Resetează și Reîncarcă
        </button>
      </div>
    </div>
  `;
}
