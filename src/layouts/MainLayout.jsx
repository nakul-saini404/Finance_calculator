import { Box } from "@mui/material";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function MainLayout({ activePage, onNavigate, children }) {
  const SIDEBAR_W = 240;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <Box sx={{ marginLeft: `${SIDEBAR_W}px`, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
        <Topbar activePage={activePage} />
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}