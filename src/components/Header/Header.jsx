import { useContext } from 'react';
import UserContext from '../../contexts/UserContext';

function Header() {
  const { user } = useContext(UserContext);

  return <header></header>;
}

export default Header;
