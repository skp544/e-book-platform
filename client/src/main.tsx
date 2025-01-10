import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import AuthProvider from "./context/AuthProvider.tsx";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CartProvider from "./context/CartProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <CartProvider>
            <NextUIProvider>
              <App />
              <Toaster position="top-center" reverseOrder={false} />
            </NextUIProvider>
          </CartProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
