import { Box } from "@mui/material";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export function MainLayout({ activePage, onNavigate, children }) {
  const SIDEBAR_W = 240;
  const [open, setOpen] = useState(false);

  return (
    // <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
    //   <Sidebar activePage={activePage} onNavigate={onNavigate} />
    //   <Box sx={{ marginLeft: `${SIDEBAR_W}px`, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
    //     <Topbar activePage={activePage} />
    //     <Box sx={{ flex: 1, overflow: 'hidden' }}>
    //       {children}
    //     </Box>
    //   </Box>
    // </Box>

    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
  
  {/* Sidebar */}
  <Box
    sx={{
      display: { xs: 'none', md: 'block' } // ❌ hide on mobile
    }}
  >
    <Sidebar activePage={activePage} onNavigate={onNavigate} />
  </Box>

  {/* Main Content */}
  <Box
    sx={{
      marginLeft: { xs: 0, md: `${SIDEBAR_W}px` }, // ✅ remove margin on mobile
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}
  >
    <Topbar activePage={activePage} />

    <Box sx={{ flex: 1, overflow: 'auto' }}>
      {children}
    </Box>
  </Box>

</Box>

  );
}