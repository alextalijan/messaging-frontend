import { useState, useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import { useNavigate } from 'react-router';

function NewChatModal() {
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
    <div>
      <h2>Create a new chat</h2>
      {error && <p>{error}</p>}
      <form>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={chatName}
            onChange={handleInputChange}
          />
        </label>
        <label>
          People:
          <input
            type="text"
            name="person"
            value={personInput}
            onChange={handleInputChange}
          />
        </label>
        <button type="button" onClick={handlePersonAdd}>
          Add person
        </button>
        {people.length > 0 && (
          <ul>
            {people.map((person) => {
              return (
                <li>
                  {person}{' '}
                  <button
                    type="button"
                    onClick={() => handlePersonRemove(person)}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <button type="button" onClick={createChat}>
          Create Chat
        </button>
      </form>
    </div>
  );
}

export default NewChatModal;
