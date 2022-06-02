import Navbar from './components/layout/Navbar/Navbar.js';
import Footer from './components/layout/Footer/Footer.js';
import { Outlet } from "react-router-dom";
import './App.css';

function App() {
  // JSX expressions must have one parent element
  return (
    <div className="div__app-wrapper">
      <div className="div__content">
          <Navbar />
          <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
