import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Layout from './pages/Layout/Layout';
import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound';
import Dashboard from './components/Dashboard/Dashboard';
import TransactionList from './components/Transactions/TransactionList';
import FinancialCharts from './components/Charts/FinancialCharts';
import ExcelDownload from './pages/ExcelDownload/ExcelDownload'; // Add this import
import ExcellInitialiser from './pages/ExcelFormInitialisation/ExcelcellInitialiser';//add this import
import ViewSavedData from './pages/ExcelFormInitialisation/ViewSavedData';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<TransactionList />} />
          <Route path="analytics" element={<FinancialCharts />} />
          <Route path="excel-download" element={<ExcelDownload />} /> {/* Add this route */}
          <Route path="excellinitialiser" element={<ExcellInitialiser />} /> {/* Add this route */}
          <Route path="viewsaveddata" element={<ViewSavedData />} /> {/* Add this route */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;