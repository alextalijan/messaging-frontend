import UserContext from '../../contexts/UserContext';
import { useContext } from 'react';
import styles from './Message.module.css';

function Message({ sender, text, anotherMessage }) {
  const { user } = useContext(UserContext);

  const textStyle = {
    backgroundColor:
      sender === user.username ? 'var(--primary-color)' : 'white',
  };

  const messageStyle = {
    alignSelf: sender === user.username ? 'end' : 'start',
  };

  const senderStyle = {
    alignSelf: sender === user.username ? 'end' : 'start',
    left: sender === user.username ? '-0.5rem' : '0.5rem',
  };

  return (
    <div className={styles.message} style={messageStyle}>
      <p className={styles.text} style={textStyle}>
        {text}
      </p>
      {!anotherMessage && (
        <b className={styles.sender} style={senderStyle}>
          {sender === user.username ? 'You' : sender}
        </b>
      )}
    </div>
  );
}

export default Message;
