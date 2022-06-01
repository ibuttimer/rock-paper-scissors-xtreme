import Footer from './components/layout/Footer/Footer.js';
import './App.css';

function App() {
  // JSX expressions must have one parent element
  return (
    <div className="app-wrapper">
      <div className="content">
          <header>
          </header>
          <main>
              <h1>This is a H1 heading</h1>
              <h2>This is a H2 heading</h2>
              <h3>This is a H3 heading</h3>
              <h4>This is a H4 heading</h4>
              <h5>This is a H5 heading</h5>
              <h6>This is a H6 heading</h6>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
