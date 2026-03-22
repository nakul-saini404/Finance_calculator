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

const PAGES = {
  home: <HomePage />,
  emi:  <EmiPage />,
  gst:  <GstPage />,
  tax:  <TaxPage />,
  sip:  <SipPage />,
  loan: <LoanPage />,
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
        {PageComponent}
      </MainLayout>
    </ThemeProvider>
  );
}