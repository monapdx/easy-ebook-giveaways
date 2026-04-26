import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';

import LoginPage from '../features/auth/pages/LoginPage';
import SignupPage from '../features/auth/pages/SignupPage';
import AuthGuard from '../features/auth/components/AuthGuard';

import DashboardHomePage from '../features/dashboard/pages/DashboardHomePage';
import CampaignListPage from '../features/campaigns/pages/CampaignListPage';
import CampaignCreatePage from '../features/campaigns/pages/CampaignCreatePage';
import CampaignOverviewPage from '../features/campaigns/pages/CampaignOverviewPage';
import CampaignDesignPage from '../features/landingPages/pages/CampaignDesignPage';
import CampaignEntriesPage from '../features/entries/pages/CampaignEntriesPage';
import CampaignAnalyticsPage from '../features/analytics/pages/CampaignAnalyticsPage';
import PublicGiveawayPage from '../features/landingPages/pages/PublicGiveawayPage';
import GiveawaySuccessPage from '../features/landingPages/pages/GiveawaySuccessPage';
import DownloadPage from '../features/downloads/pages/DownloadPage';

export function AppRouter() {
  return (
    <BrowserRouter basename="/easy-ebook-giveaways">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route index element={<DashboardHomePage />} />
          <Route path="campaigns" element={<CampaignListPage />} />
          <Route path="campaigns/new" element={<CampaignCreatePage />} />
          <Route path="campaigns/:campaignId" element={<CampaignOverviewPage />} />
          <Route path="campaigns/:campaignId/design" element={<CampaignDesignPage />} />
          <Route path="campaigns/:campaignId/entries" element={<CampaignEntriesPage />} />
          <Route path="campaigns/:campaignId/analytics" element={<CampaignAnalyticsPage />} />
        </Route>

        <Route path="/g/:slug" element={<PublicLayout />}>
          <Route index element={<PublicGiveawayPage />} />
          <Route path="success" element={<GiveawaySuccessPage />} />
        </Route>

        <Route path="/download/:token" element={<DownloadPage />} />
      </Routes>
    </BrowserRouter>
  );
}