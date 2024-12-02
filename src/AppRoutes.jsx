import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import About from './About.jsx';

const AppRoutes = () => (
  <Router basename="/Ear-Training-Online">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </Router>
);

export default AppRoutes;