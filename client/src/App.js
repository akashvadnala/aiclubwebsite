import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Team from './components/Team/Team';
import Projects from './components/Projects/Projects';
import Induct from './components/Inductions/Induct';
import Footer from './components/Footer/Footer';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import React from 'react';
import { Helmet } from 'react-helmet';
import Register from './components/Inductions/Register';
import TeamUpdate from './components/Team/TeamUpdate';
import TeamAdd from './components/Team/TeamAdd';

const Routing = () => {
  return(
    <Routes>
      <Route exact path='/' element={<Home />} />
      <Route exact path='/team' element={<Team />} />
      <Route exact path='/projects' element={<Projects />} />
      <Route exact path='/inductions' element={<Induct />} />
      <Route exact path='/inductions/register' element={<Register />} />
      <Route exact path='/team/edit/:username' element={<TeamUpdate />} />
      <Route exact path='/team/add' element={<TeamAdd />} />


    </Routes>
  )
}


function App() {
  return (
    <>
      <Helmet>
        <title>AI CLUB - NITC</title>
      </Helmet>
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
