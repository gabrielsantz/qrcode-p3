import { Navbar, Container, Nav } from "react-bootstrap";
import qrcode from "../assets/qrcode.png"; 

function Header() {
  return (
    <Navbar bg="light" expand="md" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img
            src={qrcode}
            alt="Logo"
            width="40"
            height="40"
            className="me-2"
          />
          <span className="fw-bold">Sistema de Presença - UFAL</span>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;