import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DatasetsPage from './pages/DatasetsPage.jsx';
import PipelinesPage from './pages/PipelinesPage.jsx';
import RunsPage from './pages/RunsPage.jsx';
import AlertsPage from './pages/AlertsPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="datasets" element={<DatasetsPage />} />
          <Route path="pipelines" element={<PipelinesPage />} />
          <Route path="runs" element={<RunsPage />} />
          <Route path="alerts" element={<AlertsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
