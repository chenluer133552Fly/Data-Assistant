var config = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                ink: "#17202A",
                graphite: "#4E5A66",
                shell: "#F7F9FB",
                mist: "#E9F0F4",
                line: "#D8E2E8",
                signal: "#0E7C86",
                coral: "#F26B5E",
                amber: "#F5B84B",
                violet: "#7158E2"
            },
            fontFamily: {
                display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
                body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "SFMono-Regular", "Consolas", "monospace"]
            },
            boxShadow: {
                panel: "0 14px 45px rgba(23, 32, 42, 0.08)"
            }
        },
    },
    plugins: [],
};
export default config;
