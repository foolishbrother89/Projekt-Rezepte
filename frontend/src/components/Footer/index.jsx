
import { Container } from 'react-bootstrap';

export default () => (
  <footer className="fixed-bottom">
    <Container>
      <div className="d-flex justify-content-center align-items-center">
        <a 
          href="https://github.com/foolishbrother89/Projekt-Rezepte" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-decoration-none me-4"
          style={{ color: '#0d6efd' }}
        >
          Github
        </a>
        
        {/* Trennlinie als visueller Separator */}
        <span className="text-muted me-4">|</span>
        
        <p className="mb-0 text-muted">
          © {new Date().getFullYear()} Unsere RezepteSammlung
        </p>
      </div>
    </Container>
  </footer>
);