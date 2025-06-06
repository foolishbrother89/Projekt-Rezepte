import { Link } from "react-router-dom";
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import nodeLogo from '../assets/nodejs.svg'; 
import '../App.css';

function Home({ count, setCount }) {
  return (
    <div>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">
          <img src={nodeLogo} className="logo" alt="Node.js logo" />
        </a>
      </div>

      <h1>Vite + React + Node.js</h1>
      <h1>Rezepte Sammlung Intranet Projekt</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p className="read-the-docs">
        Click on the logos to learn more about Vite, React, and Node.js
      </p>
      <p className="read-the-docs">
        Check out <a href="https://expressjs.com" target="_blank" rel="noopener noreferrer">Express.js</a> for building server-side apps with Node.js.
      </p>
    </div>
  );
}

export default Home;