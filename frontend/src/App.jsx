import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DatasetsPage from './pages/DatasetsPage.jsx';
import PipelineDetailPage from './pages/PipelineDetailPage.jsx';
import PipelinesPage from './pages/PipelinesPage.jsx';
import RunDetailPage from './pages/RunDetailPage.jsx';
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
          <Route path="pipelines/:id" element={<PipelineDetailPage />} />
          <Route path="runs" element={<RunsPage />} />
          <Route path="runs/:id" element={<RunDetailPage />} />
          <Route path="alerts" element={<AlertsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
