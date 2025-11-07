import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './helpers/ProtectedRoute';
import Home from './components/Home';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Client from './components/Client'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/client" element={<Client />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
