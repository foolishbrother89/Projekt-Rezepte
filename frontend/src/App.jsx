import { useState, useEffect } from 'react'

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import './App.css'

import Home from './components/home';
import Register from './components/register';
import Login from './components/login';
import EigeneRezepte from './components/eigenerezepte';

function App() {
  const [count, setCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  /* 
    Wenn die Seite neu geladen wird, verlieren wir den React-State 
    (isLoggedIn und userId werden zurückgesetzt).
    Der Local Storage behält zwar token und userId, aber deine App weiß nichts davon, 
    weil der State neu initialisiert wird.
    Deswegen brauchen wir diesen useEffect Hook
    Prüfen, ob ein Token und userId im Local Storage vorhanden ist
    Wenn ja aktualisiert isLoggedIn und userId
  */
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');

    if (token && storedUserId) {
        setIsLoggedIn(true);
        setUserId(storedUserId);
    }
  }, []);

  // Logout löscht localStorage werte und setzt die reaktive Variable isLoggedIn 
  // zu false und navigiert zur startseite
  const handleLogout = () => {
    localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        navigate('/');
  };

  return (
    <>
      {/* Navigation mit React-Bootstrap Navbar */}
      <Navbar expand="lg" className="bg-body-tertiary fixed-top">
        <Container>
          {/* Brand-Logo/Link zur Startseite */}
          <Navbar.Brand as={Link} to="/">Wilkommen</Navbar.Brand>
          
          {/* Burger-Menü für mobile Ansicht */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          {/* Navigationslinks */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" activeKey={location.pathname}>
           
              <Nav.Link as={Link} to="/">Home</Nav.Link>

              <Nav.Link as={Link} to="/register">Registrieren</Nav.Link>

              {/* 
                Wennn du eingelogt bist zeige link zu logout(ist aber nur ein Knopf der dich auslogt)
                wenn nicht: zeige link zu login
              */}
              {isLoggedIn ?
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                :
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              }
              {/* 
                Wenn man eingeloggt ist soll in der Navleiste eigene Rezepte sichtbar werden
              */}
              {isLoggedIn && <Nav.Link as={Link} to="/eigenerezepte">Eigene Rezepte</Nav.Link>}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hauptinhalt der App */}
      <div className="app">
        <main>
          {/* React Router Konfiguration */}
          <Routes>
            {/* Route für die Startseite */}
            <Route path="/" 
                   element={
                   <Home count={count} 
                         setCount={setCount}
                   />} />
            
            {/* Route Registrieren */}
            <Route path="/register" 
                   element={<Register />} />

            {/* Route Login */}
            <Route path="/login" 
                   element={<Login
                      isLoggedIn={isLoggedIn} 
                      setIsLoggedIn={setIsLoggedIn}  />} />
            
            {/* Route eigeneRezepte */}
            <Route path="/eigenerezepte" 
                   element={<EigeneRezepte />} />
          </Routes>
        </main>
      </div>

    </>
  )
}

export default App
