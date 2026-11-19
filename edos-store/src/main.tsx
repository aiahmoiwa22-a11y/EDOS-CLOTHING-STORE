import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@/context/ThemeContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";

// HashRouter keeps every page working on any static host (no server rewrites needed).
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider><CurrencyProvider>
        <ProductsProvider>
          <CartProvider>
            <AdminProvider>
              <App />
            </AdminProvider>
          </CartProvider>
        </ProductsProvider>
      </CurrencyProvider></ThemeProvider>
    </HashRouter>
  </StrictMode>,
);
