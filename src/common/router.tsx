import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Spin } from "antd";

const IntelligencePage = lazy(() => import("../pages/intelligence"));
const LeadsPage = lazy(() => import("../pages/leads"));
const LeadsDetailPage = lazy(() => import("../pages/leads/detail"));
const CommunityPage = lazy(() => import("../pages/community"));
const CommunityDetailPage = lazy(() => import("../pages/community/detail"));
const ValidationPage = lazy(() => import("../pages/validation"));
const NotFound = lazy(() => import("./layout/not-found"));
const ServerError = lazy(() => import("./layout/server-error"));
const Forbidden = lazy(() => import("./layout/forbidden"));

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="route-loading">
          <Spin size="large" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/intelligence" replace />} />
        <Route path="/intelligence" element={<IntelligencePage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/leads/:id" element={<LeadsDetailPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/:id" element={<CommunityDetailPage />} />
        <Route path="/validation" element={<ValidationPage />} />
        <Route path="/error" element={<ServerError />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
