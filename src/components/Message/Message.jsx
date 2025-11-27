import UserContext from '../../contexts/UserContext';
import { useContext } from 'react';
import styles from './Message.module.css';

function Message({ sender, text }) {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.message}>
      <p className={styles.text}>{text}</p>
      <b className={styles.sender}>
        {sender === user.username ? 'You' : sender}
      </b>
    </div>
  );
}

export default Message;
