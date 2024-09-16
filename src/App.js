import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import BottomNavbar from './Navbar/BottomNavbar';
import HomeTwo from './HomeTwo';
import Header from './Header';
import EnquiryDetails from './ContactReport/EnquiryDetails';
import EmployeeDashboard from './Employee/EmployeeDashboard';
import AdminRegistration from './Admin/AdminRegistration';
import AdminProfile from './Admin/AdminProfile';




const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    axios.get('http://api.epublicnotices.in/notices')
    //new api 
      .then(response => {
        setNotices(response.data);
      })
      .catch(error => {
        console.error('Error fetching notices:', error);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainContent notices={notices} />
      </Router>
    </ThemeProvider>
  );
}

function MainContent({ notices }) {
  const location = useLocation();
  const noNavbarRoutes = ['/', '/registerpage','/adminregistration'];

  return (
    <>
      {!noNavbarRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/scan-notices" element={<Ocrpage />} />
        <Route path="/manualadd" element={<ManualAdd />} />
        <Route path="/dashboard" element={<Homepage />} />
        <Route path="/registerpage" element={<RegisterPage />} />
        <Route path="/allnotice" element={<AllnoticeTable notices={notices} />} />
        <Route path="/pdfreader" element={<PdfReader />} />
        <Route path="/card" element={<Card />} />
        <Route path='/secondhome' element={<HomeTwo/>} />
        <Route path="/notices/:id" element={<NoticeDetails notices={notices} />} />
        <Route path='/allenquiry' element={<EnquiryDetails/>} />
        <Route path='/employeedashboard' element={<EmployeeDashboard/>} />
        <Route path='/adminregistration' element={<AdminRegistration/>} />
        <Route path='/adminprofile' element={<AdminProfile/>} />
        
        
      </Routes>
      {!noNavbarRoutes.includes(location.pathname) && <BottomNavbar />}
    </>
  );
}

export default App;
