import React, { Suspense } from "react";
import Navbar from './components/Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet';
import Footer from './components/Footer/Footer';


const Routing = React.lazy(() => import("./Routing.js"))


// const Routing = () => {
//   return(
//     <Routes>
//       <Route path='/' element={<Home />} />
//       <Route path='/team' element={<Team />} />
//       <Route path='/projects' element={<Projects />} />
//       <Route path='/inductions' element={<Induct />} />
//       <Route exact path='/inductions/overview' element={<Overview />} />
//       <Route exact path='/inductions/data' element={<Data />} />
//       <Route exact path='/inductions/leaderboard' element={<Leaderboard />} />
//     </Routes>
//   )
// }

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
