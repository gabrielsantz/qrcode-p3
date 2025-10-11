import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom'; // Importe NavLink
import { useAuth } from '../AuthContext';
import qrcode from '../assets/qrcode.png'; 

const NavLinks = ({ role }) => {
  switch (role) {
    case 'teacher':
      return (
        <>
          <Nav.Link as={NavLink} to="/professor">Página Inicial</Nav.Link>
          <Nav.Link as={NavLink} to="/professor/classes">Iniciar Chamada</Nav.Link>
          <Nav.Link as={NavLink} to="/professor/reports">Meus Relatórios</Nav.Link>
        </>
      );
    case 'student':
      return (
        <>
          <Nav.Link as={NavLink} to="/student">Página Inicial</Nav.Link>
          <Nav.Link as={NavLink} to="/student/qr-reader">Marcar Presença</Nav.Link>
          <Nav.Link as={NavLink} to="/student/attendance">Meu Histórico</Nav.Link>
        </>
      );
    case 'admin':
      return (
        <>
          <Nav.Link as={NavLink} to="/admin">Página Inicial</Nav.Link>
          <Nav.Link as={NavLink} to="/admin/user-management">Gerenciar Usuários</Nav.Link>
          <Nav.Link as={NavLink} to="/admin/course-management">Gerenciar Matérias</Nav.Link>
          <Nav.Link as={NavLink} to="/admin/all-reports">Todos os Relatórios</Nav.Link>
        </>
      );
    default:
      return null;
  }
};

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }} className="d-flex align-items-center">
          <img src={qrcode} alt="Logo" width="55" height="55" className="me-2" />
          <span className="fw-bold ">PresençaQR</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && <NavLinks role={user.role} />}
          </Nav>
          {user && (
            <Nav className="ms-auto d-flex align-items-center flex-row">
              <Navbar.Text className="me-3">
                Olá, <strong>{user.name || user.email}</strong>
              </Navbar.Text>
              <Button variant="outline-danger" size="sm" onClick={logout}>
                Sair
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;