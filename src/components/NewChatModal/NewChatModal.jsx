import { useState, useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import { useNavigate } from 'react-router';
import styles from './NewChatModal.module.css';

function NewChatModal({ close }) {
  const [people, setPeople] = useState([]);
  const [chatName, setChatName] = useState('');
  const [personInput, setPersonInput] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  function handleInputChange(event) {
    const { name, value } = event.target;

    switch (name) {
      case 'name':
        setChatName(value);
        break;
      case 'person':
        setPersonInput(value);
    }
  }

  function handlePersonAdd() {
    // Check if the input is empty
    if (personInput === '') return;

    // Check if the person is trying to add themlselves
    if (personInput === user.username) {
      return setError('You cannot add yourself.');
    }

    // Check if the person is already in the list
    if (people.includes(personInput)) {
      return setError(`You've already added ${personInput}.`);
    }

    // Check if the user with that username exists
    fetch(import.meta.env.VITE_API + `/users/${personInput}`)
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return setError(response.message);
        }

        setPeople((prev) => [...prev, personInput]);
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  function handlePersonRemove(name) {
    setPeople(people.filter((person) => person !== name));
  }

  function createChat() {
    // Check if the name of the chat is provided
    if (chatName === '') {
      return setError('You must have a name for the chat.');
    }

    // Check if any people are added
    if (people.length === 0) {
      return setError('You have to add at least one person to a chat.');
    }

    // Add the user himself to chat members
    people.push(user.username);

    // Send a post request to create a chat
    fetch(import.meta.env.VITE_API + '/chats', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: chatName,
        members: people,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return setError(json.message);
        }

        // Navigate to the home page to refresh chats
        navigate('/chats');
      });
  }

  return (
    <>
      <div className={styles.backdrop} onClick={close}></div>
      <div className={styles.modal}>
        <h2 className={styles.heading}>Create a new chat</h2>
        <p className={styles.error}>{error}</p>
        <form className={styles.form}>
          <label className={styles.input}>
            <span className={styles['input-label']}>Name:</span>
            <input
              type="text"
              name="name"
              value={chatName}
              onChange={handleInputChange}
              className={styles['regular-input']}
            />
          </label>
          <label className={styles.input}>
            <span className={styles['input-label']}>People:</span>
            <input
              type="text"
              name="person"
              value={personInput}
              onChange={handleInputChange}
              className={styles['btn-input']}
            />
            <button
              type="button"
              onClick={handlePersonAdd}
              className={styles['add-person-btn']}
            >
              Add
            </button>
          </label>
          {people.length > 0 && (
            <ul className={styles['members-list']}>
              {people.map((person) => {
                return (
                  <li className={styles['person-listing']}>
                    {person}{' '}
                    <button
                      type="button"
                      onClick={() => handlePersonRemove(person)}
                      className={styles['remove-person-btn']}
                    >
                      x
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className={styles['center-btn-wrapper']}>
            <button
              type="button"
              onClick={createChat}
              className={styles['create-chat-btn']}
            >
              Create Chat
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default NewChatModal;
