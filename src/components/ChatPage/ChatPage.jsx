import { useContext, useEffect, useState } from 'react';
import UserContext from '../../contexts/UserContext';

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const { user } = useContext(UserContext);

  // Fetch user's chats
  useEffect(() => {
    fetch(import.meta.env.VITE_API + `/users/${user.username}/chats`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return alert(response.message);
        }

        // Load the chats and set the active chat to the latest one
        setChats(response.chats);
        setActiveChatId(response.chats[0].id);
      });
  }, [user.username]);

  return (
    <>
      <h1>Dashboard</h1>
      <div>
        <div>
          <h2>CHATS</h2>
          {chats.map((chat) => {
            return;
          })}
        </div>
        <div>{/* <h2>{activeChat.name}</h2> */}</div>
      </div>
    </>
  );
}

export default ChatPage;
