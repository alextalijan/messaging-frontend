import { useContext } from 'react';
import styles from './Chat.module.css';
import UserContext from '../../contexts/UserContext';

function Chat({ name, lastMessage, openChat }) {
  const { user } = useContext(UserContext);

  return (
    <div className={styles['chat-listing']} onClick={openChat}>
      <span className={styles['chat-name']}>{name}</span>
      {lastMessage ? (
        <span className={styles['last-msg']}>
          {lastMessage.sender.username === user.username
            ? 'You'
            : lastMessage.sender.username}
          : {lastMessage.text}
        </span>
      ) : (
        <p className={styles['last-msg']}>No messages yet.</p>
      )}
    </div>
  );
}

export default Chat;
