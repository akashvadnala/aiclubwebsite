import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Team from './components/Team/Team';
import Projects from './components/Projects/Projects';
import Footer from './components/Footer/Footer';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import React from 'react';

const Routing = () => {
  return(
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/team' element={<Team />} />
      <Route path='/projects' element={<Projects />} />
    </Routes>
  )
}


function App() {
  return (
    <>
      <Navbar />
      <React.Suspense fallback="loading...">
        <ScrollToTop />
        <Routing />
      </React.Suspense>
      <Footer />
    </>
  );
}

export default App;
