import React, { Suspense } from "react";
import Navbar from './components/Navbar/Navbar';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet';
import Footer from './components/Footer/Footer';


const Routing = React.lazy(() => import("./Routing.js"))



function App() {
  
  return (
    <>
      <Helmet>
        <title>AI CLUB - NITC</title>
      </Helmet>
      <Navbar />
      <ScrollToTop />
      <Suspense fallback={<div>Loading...</div>}>
        <Routing />
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
