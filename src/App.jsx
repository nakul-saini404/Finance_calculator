import { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme.js';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { EmiPage } from './pages/emi/EmiPage';
import { GstPage } from './pages/gst/GstPage';
import { TaxPage } from './pages/tax/TaxPage';
import { SipPage } from './pages/sip/SipPage';
import { LoanPage } from './pages/loan/LoanPage';
import { Routes, Route } from "react-router-dom";
import { FdPage } from './pages/fd/FdPage';
import { GoalPage } from './pages/goal/GoalPage.jsx';
import { NetWorthPage } from './pages/netWorth/NetWorthPage.jsx';
import { RetirementPage } from './pages/retirement/RetirementPage.jsx';
import HubNavbar from './components/HubNavbar';



const PAGES = {
  home: <HomePage />,
  emi: <EmiPage />,
  gst: <GstPage />,
  tax: <TaxPage />,
  sip: <SipPage />,
  loan: <LoanPage />,
  fd: <FdPage />,
  retirement: <RetirementPage />,
  goal: <GoalPage />,
  networth: <NetWorthPage />,
};

export default function App() {
  const [activePage, setActivePage] = useState('home');

  // Pass navigate handler to HomePage so cards can navigate
  const PageComponent = activePage === 'home'
    ? <HomePage onNavigate={setActivePage} />
    : PAGES[activePage];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayout activePage={activePage} onNavigate={setActivePage}>
        {/* {PageComponent } */}
        <Routes>
          <HubNavbar />
          <Route path="/" element={<HomePage />} />
          <Route path="/emi" element={<EmiPage />} />
          <Route path="/gst" element={<GstPage />} />
          <Route path="/tax" element={<TaxPage />} />
          <Route path="/sip" element={<SipPage />} />
          <Route path="/loan" element={<LoanPage />} />
          <Route path="/fd" element={<FdPage />} />
          <Route path="/goal" element={<GoalPage />} />
          <Route path="/networth" element={<NetWorthPage />} />
          <Route path="/retirement" element={<RetirementPage />} />
        </Routes>
      </MainLayout>
    </ThemeProvider>
  );
}