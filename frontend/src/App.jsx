import { useState, useEffect } from 'react'

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import './App.css'

import Home from './components/home';
import Register from './components/register';
import Login from './components/login';

function App() {
  const [count, setCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

              <Nav.Link as={Link} to="/login">Login</Nav.Link>

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
              
          </Routes>
        </main>
      </div>

    </>
  )
}

export default App
