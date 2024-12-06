import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import './App.css';
import Ocrpage from './Ocrpage';
import Homepage from './Homepage';
import ManualAdd from './ManualAdd';
import LoginPage from './LoginPage';
import RegisterPage from './Registerpage';
import AllnoticeTable from './AllnoticeTable';
import PdfReader from './PdfReader';
import NoticeDetails from './NoticeDetails';
import Card from './Card';
import HomeTwo from './HomeTwo';
import EnquiryDetails from './ContactReport/EnquiryDetails';
import EmployeeDashboard from './Employee/EmployeeDashboard';
import AdminRegistration from './Admin/AdminRegistration';
import AdminProfile from './Admin/AdminProfile';
import OcrMarathiHindi from './OcrPages/OcrMarathiHindi';
import Scannotices1 from './Scannotices1/Scannotices1';
import RequestPost from './RequestPostManagement/RequestPost';
import { PrivateRoute, PublicRoute } from './RouteGuards'; // Import route guards

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    axios
      .get('http://api.epublicnotices.in/notices')
      .then((response) => {
        setNotices(response.data);
      })
      .catch((error) => {
        console.error('Error fetching notices:', error);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/registerpage" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Private Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Homepage /></PrivateRoute>} />
          <Route path="/scan-notices" element={<PrivateRoute><Ocrpage /></PrivateRoute>} />
          <Route path="/manualadd" element={<PrivateRoute><ManualAdd /></PrivateRoute>} />
          <Route path="/all-notice" element={<PrivateRoute><AllnoticeTable notices={notices} /></PrivateRoute>} />
          <Route path="/pdfreader" element={<PrivateRoute><PdfReader /></PrivateRoute>} />
          <Route path="/card" element={<PrivateRoute><Card /></PrivateRoute>} />
          <Route path="/notices/:id" element={<PrivateRoute><NoticeDetails notices={notices} /></PrivateRoute>} />
          <Route path="/allenquiry" element={<PrivateRoute><EnquiryDetails /></PrivateRoute>} />
          <Route path="/employeedashboard" element={<PrivateRoute><EmployeeDashboard /></PrivateRoute>} />
          <Route path="/adminregistration" element={<PrivateRoute><AdminRegistration /></PrivateRoute>} />
          <Route path="/adminprofile" element={<PrivateRoute><AdminProfile /></PrivateRoute>} />
          <Route path="/mar-hin-ocr" element={<PrivateRoute><OcrMarathiHindi /></PrivateRoute>} />
          <Route path="/scannotice" element={<PrivateRoute><Scannotices1 /></PrivateRoute>} />
          <Route path="/requestpost" element={<PrivateRoute><RequestPost /></PrivateRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
