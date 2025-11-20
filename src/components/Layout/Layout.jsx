import Header from '../Header/Header';
import { Outlet } from 'react-router';

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
