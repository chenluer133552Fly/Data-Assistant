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

const navigation = [
    {
        path: "/intelligence",
        label: "Intelligence Radar",
        icon: <RadarChartOutlined />,
    },
    { path: "/leads", label: "Leads Ideation", icon: <BulbOutlined /> },
    {
        path: "/community",
        label: "Ideation Community",
        icon: <GlobalOutlined />,
    },
    { path: "/validation", label: "Validation", icon: <InboxOutlined /> },
];

function Shell() {
    const [mobileMenu, setMobileMenu] = useState(false);
    return (
        <div className="workspace">
            <header className="app-header fixed inset-[0_0_auto] h-[38px] z-[100] bg-[var(--teal-dark)] text-[#edf6f2] flex items-center justify-between p-[0_17px_0_12px] text-[12px] [&_.mobile-menu-toggle]:hidden mobile:h-[44px] mobile:px-[9px] mobile:[&_.mobile-menu-toggle]:inline-flex mobile:[&_.mobile-menu-toggle]:text-[#e7f1ec] mobile:[&_.mobile-menu-toggle]:w-[26px]">
                <div className="header-brand flex items-center gap-[9px] font-semibold tracking-[0.1px] mobile:text-[10px] mobile:gap-[6px]">
                    <Button
                        className="mobile-menu-toggle"
                        type="text"
                        aria-label="Toggle navigation"
                        icon={<MenuOutlined />}
                        onClick={() => setMobileMenu(!mobileMenu)}
                    />
                    <span
                        className="brand-mark w-[22px] h-[22px] rounded-full grid place-items-center font-[Georgia,_serif] text-white font-bold text-[16px] bg-[#ed405b] [border:2px_solid_#f88c9d] leading-[1]"
                        aria-hidden="true"
                    >
                        M
                    </span>
                    <span>
                        Meridian{" "}
                        <span className="brand-separator opacity-[0.5] m-[0_3px]">
                            ·
                        </span>{" "}
                        Market Intelligence
                    </span>
                </div>
                <div className="header-user flex items-center gap-[9px] [&_.ant-avatar]:bg-[#d9e7e2] [&_.ant-avatar]:text-[#97b8a9] mobile:text-[10px]">
                    <DoubleRightOutlined className="header-chevron [transform:rotate(-90deg)] opacity-[0.7] mr-[6px] mobile:hidden" />
                    <span>Ember Gao</span>
                    <Avatar size={24} icon={<UserOutlined />} />
                </div>
            </header>
            {mobileMenu && (
                <button
                    className="sidebar-backdrop hidden mobile:block mobile:fixed mobile:inset-[44px_0_0] mobile:bg-[#122d3159] mobile:z-[85] mobile:[border:0]"
                    aria-label="Close navigation"
                    onClick={() => setMobileMenu(false)}
                />
            )}
            <aside
                className={`app-sidebar fixed z-[90] top-[38px] bottom-[0] left-[0] w-[224px] bg-[var(--teal)] p-[22px_12px] [&_nav]:flex [&_nav]:flex-col [&_nav]:gap-[7px] compact:w-[205px] compact:px-[9px] mobile:top-[44px] mobile:w-[224px] mobile:[transform:translateX(-100%)] mobile:[transition:transform_0.2s] mobile:[&.is-open]:[transform:translateX(0)] ${mobileMenu ? "is-open" : ""}`}
            >
                <nav aria-label="Main navigation">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenu(false)}
                            className={({ isActive }) =>
                                `nav-item flex items-center gap-[11px] p-[12px_13px] text-[13px] font-semibold no-underline text-[#d5ebe4] rounded-[4px] [transition:background_0.15s] [&_>_.anticon]:text-[17px] [&:hover:not(.active)]:bg-[#137360] [&:hover]:text-white [&.active]:bg-[var(--rose)] [&.active]:text-white ${isActive ? "active" : ""}`
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <main className="app-content ml-[224px] p-[76px_44px_36px] min-h-screen wide:pt-[84px] compact:ml-[205px] compact:px-[30px] tablet:px-[22px] mobile:ml-[0] mobile:p-[72px_17px_25px]">
                <div className="content-inner max-w-[1220px] m-[0_auto]">
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
