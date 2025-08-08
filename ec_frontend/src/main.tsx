import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";

Sentry.init({
  dsn: "https://4904e13078ab3511a40afa58cd4c6eae@o4509635507781632.ingest.us.sentry.io/4509803322343424",
  sendDefaultPii: true,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
