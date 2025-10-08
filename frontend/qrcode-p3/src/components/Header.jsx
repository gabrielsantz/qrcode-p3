import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useAuth } from "../AuthContext"; 
import qrcode from "../assets/qrcode.png"; 

function Header() {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="light" expand="md" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img
            src={qrcode}
            alt="Logo PresençaQR"
            width="55"
            height="55"
            className="me-2"
          />
          <span className="fw-bold">Sistema de Presença - UFAL</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" /> 
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            {user && (
              <>
                <Button variant="outline-danger" onClick={logout}> 
                  Sair
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;