import UserContext from '../../contexts/UserContext';
import { useContext } from 'react';

function Message({ sender, text }) {
  const { user } = useContext(UserContext);

  return (
    <div>
      <p>{text}</p>
      <span>{sender === user.username ? 'You' : sender}</span>
    </div>
  );
}

export default Message;
