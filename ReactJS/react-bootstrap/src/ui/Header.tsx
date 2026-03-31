import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

type HeaderProps = {
    appTitle: string;
};

const Header = ({ appTitle }: HeaderProps) => (
    <Navbar   bg="dark" data-bs-theme="dark" expand="sm">
        <Container fluid>
            <Navbar.Brand href="#">{appTitle}</Navbar.Brand>
        </Container>
    </Navbar>
);

export default Header;