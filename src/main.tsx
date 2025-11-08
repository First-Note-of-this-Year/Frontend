import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

if (window.Kakao && !window.Kakao.isInitialized()) {
  const kakaoKey = import.meta.env.VITE_APP_JAVASCRIPT_KEY;
  if (kakaoKey) {
    window.Kakao.init(kakaoKey);
    console.log("Kakao SDK initialized:", window.Kakao.isInitialized());
  } else {
    console.warn(
      "Kakao JavaScript Key is not defined in environment variables"
    );
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
