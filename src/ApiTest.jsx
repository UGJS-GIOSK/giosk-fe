import { Outlet } from 'react-router-dom';
import Header from './components/Header';

function ApiTest() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default ApiTest;
