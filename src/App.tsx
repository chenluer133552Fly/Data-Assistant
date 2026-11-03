import { Avatar, Button, ConfigProvider, App as AntApp } from "antd";
import {
  BulbOutlined,
  DoubleRightOutlined,
  GlobalOutlined,
  InboxOutlined,
  MenuOutlined,
  RadarChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { BrowserRouter, NavLink } from "react-router-dom";
import { WorkspaceProvider } from "./common/workspace";
import { GenerationTasks } from "./components/generation-tasks";
import AppRoutes from "./common/router";
import "./App.css";

const navigation = [
  {
    path: "/intelligence",
    label: "Intelligence Radar",
    icon: <RadarChartOutlined />,
  },
  { path: "/leads", label: "Leads Ideation", icon: <BulbOutlined /> },
  { path: "/community", label: "Ideation Community", icon: <GlobalOutlined /> },
  { path: "/validation", label: "Validation", icon: <InboxOutlined /> },
];

function Shell() {
  const [mobileMenu, setMobileMenu] = useState(false);
  return (
    <div className="workspace">
      <header className="app-header">
        <div className="header-brand">
          <Button
            className="mobile-menu-toggle"
            type="text"
            aria-label="Toggle navigation"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenu(!mobileMenu)}
          />
          <span className="brand-mark" aria-hidden="true">
            M
          </span>
          <span>
            Meridian <span className="brand-separator">·</span> Market
            Intelligence
          </span>
        </div>
        <div className="header-user">
          <DoubleRightOutlined className="header-chevron" />
          <span>Ember Gao</span>
          <Avatar size={24} icon={<UserOutlined />} />
        </div>
      </header>
      {mobileMenu && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileMenu(false)}
        />
      )}
      <aside className={`app-sidebar ${mobileMenu ? "is-open" : ""}`}>
        <nav aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenu(false)}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="app-content">
        <div className="content-inner">
          <AppRoutes />
        </div>
      </main>
      <GenerationTasks />
    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00896b",
          colorInfo: "#00896b",
          colorError: "#e3154d",
          colorText: "#344743",
          colorTextSecondary: "#7e858c",
          colorBorder: "#e4e7eb",
          fontFamily: '"Segoe UI", Arial, sans-serif',
          fontSize: 13,
          borderRadius: 6,
          controlHeight: 34,
        },
        components: {
          Button: { primaryShadow: "none" },
          Tabs: {
            inkBarColor: "#e3154d",
            itemSelectedColor: "#087461",
            itemColor: "#7e858c",
          },
        },
      }}
    >
      <AntApp message={{ duration: 3, maxCount: 3 }}>
        <BrowserRouter>
          <WorkspaceProvider>
            <Shell />
          </WorkspaceProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}
