import { renderToString } from "react-dom/server";
import { ConfigProvider } from "antd";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { WorkspaceContext } from "../src/common/workspace-context";
import { createInitialDatabase } from "../src/common/mock-data";
import IntelligencePage from "../src/pages/intelligence";
import LeadsPage from "../src/pages/leads";
import LeadsDetailPage from "../src/pages/leads/detail";
import CommunityPage from "../src/pages/community";
import CommunityDetailPage from "../src/pages/community/detail";
import ValidationPage from "../src/pages/validation";

export function renderPage(path: string) {
  return renderToString(
    <ConfigProvider>
      <WorkspaceContext.Provider
        value={{
          database: createInitialDatabase(),
          loading: false,
          error: "",
          reload: async () => {},
          update: () => {},
          generating: false,
          task: { open: false, step: 0, description: "", error: "", run: 0 },
          closeTask: () => {},
          generate: async () => true,
        }}
      >
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/intelligence" element={<IntelligencePage />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/leads/:id" element={<LeadsDetailPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:id" element={<CommunityDetailPage />} />
            <Route path="/validation" element={<ValidationPage />} />
          </Routes>
        </MemoryRouter>
      </WorkspaceContext.Provider>
    </ConfigProvider>
  );
}
