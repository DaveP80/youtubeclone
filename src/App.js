import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import About from './components/About/About';
import Home from './components/Home/Home';
import NavBar from './components/NavBar/NavBar';
import WatchVideo from './components/Videos/WatchVideo';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/:home' element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/videos/:id" element={<WatchVideo />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
