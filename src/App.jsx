import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Residents from './pages/Residents.jsx'
import ResidentDetail from './pages/ResidentDetail.jsx'
import Scheduler from './pages/Scheduler.jsx'
import Medications from './pages/Medications.jsx'
import HealthMonitoring from './pages/HealthMonitoring.jsx'
import Caregivers from './pages/Caregivers.jsx'
import Workflows from './pages/Workflows.jsx'
import Analytics from './pages/Analytics.jsx'
import Alerts from './pages/Alerts.jsx'
import SettingsPage from './pages/Settings.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/residents/:id" element={<ResidentDetail />} />
        <Route path="/scheduler" element={<Scheduler />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/health" element={<HealthMonitoring />} />
        <Route path="/caregivers" element={<Caregivers />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Layout>
  )
}
