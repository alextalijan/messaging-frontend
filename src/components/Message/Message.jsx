import UserContext from '../../contexts/UserContext';
import { useContext, forwardRef } from 'react';
import styles from './Message.module.css';

const Message = forwardRef(function Message(props, ref) {
  const { user } = useContext(UserContext);

  const textStyle = {
    backgroundColor:
      props.sender === user.username ? 'var(--primary-color)' : 'white',
  };

  const messageStyle = {
    alignSelf: props.sender === user.username ? 'end' : 'start',
  };

  const senderStyle = {
    alignSelf: props.sender === user.username ? 'end' : 'start',
    left: props.sender === user.username ? '-0.5rem' : '0.5rem',
  };

  return (
    <div className={styles.message} style={messageStyle} ref={ref}>
      <p className={styles.text} style={textStyle}>
        {props.text}
      </p>
      {!props.anotherMessage && (
        <b className={styles.sender} style={senderStyle}>
          {props.sender === user.username ? 'You' : props.sender}
        </b>
      )}
    </div>
  );
});

export default Message;
