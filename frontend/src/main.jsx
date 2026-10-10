import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";       // wrap app with auth
import "./style.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>                                      {/* must be OUTSIDE App */}
            <App />
        </AuthProvider>
    </StrictMode>
);