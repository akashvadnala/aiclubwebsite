import React, { Suspense } from "react";
import Navbar from './components/Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet';
import Footer from './components/Footer/Footer';
import Routing from './Routing.js';

function App() {
  
  return (
    <>
      <Helmet>
        <title>AI Club - NIT Calicut</title>
      </Helmet>
      <Navbar />
      <ScrollToTop />
      <Routing />
      <Footer />
    </>
  );
}

export default App;
