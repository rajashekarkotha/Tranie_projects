import { Fragment } from 'react/jsx-runtime';
import Container from 'react-bootstrap/Container';
import Header from "./ui/Header";
import Statement from './ui/Statement';


const App = () => {

  return (
    <Fragment>
      <Header appTitle="Budget Tracker"/>
      <Container fluid className='p-2'>
        <Statement/>
      </Container>
    </Fragment>
  )
}

export default App
