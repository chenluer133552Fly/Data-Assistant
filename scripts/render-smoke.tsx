import { renderToString } from "react-dom/server";
import { ConfigProvider } from "antd";
import {
    createMemoryRouter,
    RouterProvider,
    Route,
    Routes,
} from "react-router-dom";
import { WorkspaceContext } from "../src/common/workspace-context";
import { createInitialDatabase } from "../src/common/mock-data";
import IntelligencePage from "../src/pages/intelligence";
import LeadsPage from "../src/pages/leads";
import LeadsDetailPage from "../src/pages/leads/detail";
import CommunityPage from "../src/pages/community";
import CommunityDetailPage from "../src/pages/community/detail";
import ValidationPage from "../src/pages/validation";
import ValidationDetailPage from "../src/pages/validation/detail";

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
                    task: {
                        open: false,
                        step: 0,
                        description: "",
                        error: "",
                        run: 0,
                    },
                    closeTask: () => {},
                    generate: async () => true,
                }}
            >
                <RouterProvider
                    router={createMemoryRouter(
                        [
                            {
                                path: "*",
                                element: (
                                    <Routes>
                                        <Route
                                            path="/intelligence"
                                            element={<IntelligencePage />}
                                        />
                                        <Route
                                            path="/leads"
                                            element={<LeadsPage />}
                                        />
                                        <Route
                                            path="/leads/:id"
                                            element={<LeadsDetailPage />}
                                        />
                                        <Route
                                            path="/community"
                                            element={<CommunityPage />}
                                        />
                                        <Route
                                            path="/community/:id"
                                            element={<CommunityDetailPage />}
                                        />
                                        <Route
                                            path="/validation"
                                            element={<ValidationPage />}
                                        />
                                        <Route
                                            path="/validation/:id"
                                            element={<ValidationDetailPage />}
                                        />
                                    </Routes>
                                ),
                            },
                        ],
                        { initialEntries: [path] },
                    )}
                />
            </WorkspaceContext.Provider>
        </ConfigProvider>,
    );
}
