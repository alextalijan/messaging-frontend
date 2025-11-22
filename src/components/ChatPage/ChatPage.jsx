import { useContext, useEffect, useState } from 'react';
import UserContext from '../../contexts/UserContext';
import Chat from '../Chat/Chat';
import Message from '../Message/Message';
import NewChatModal from '../NewChatModal/NewChatModal';

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [chatsError, setChatsError] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messagesError, setMessagesError] = useState(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const { user } = useContext(UserContext);

  // Fetch user's chats
  useEffect(() => {
    fetch(import.meta.env.VITE_API + `/users/${user.username}/chats`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return setChatsError(response.message);
        }

        // Load the chats and set the active chat to the latest one
        setChats(response.chats);

        // If there are any chats, set the active one to be the last one
        if (response.chats.length > 0) {
          setActiveChatId(response.chats[0].id);
        } else {
          // Else, direct the user to create a new chat
          setLoadingMessages(false);
          setMessagesError('Start a new chat.');
        }
      })
      .catch((err) => setChatsError(err.message))
      .finally(() => setLoadingChats(false));
  }, [user.username]);

  // Fetch the active chat
  useEffect(() => {
    // Skip on initial mount
    if (!activeChatId) return;

    fetch(import.meta.env.VITE_API + `/chats/${activeChatId}?page=0`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return setMessagesError(response.message);
        }

        setMessages(response.messages);
      })
      .catch((err) => {
        setMessagesError(err.message);
      })
      .finally(() => setLoadingMessages(false));
  }, [activeChatId]);

  return (
    <>
      <h1>Dashboard</h1>
      <div>
        <div>
          <h2>CHATS</h2>
          <button type="button" onClick={() => setIsNewChatModalOpen(true)}>
            New Chat
          </button>
          {loadingChats ? (
            <p>Loading chats...</p>
          ) : chatsError ? (
            <p>{chatsError}</p>
          ) : chats.length === 0 ? (
            <p>No chats yet.</p>
          ) : (
            chats.map((chat) => {
              return (
                <Chat
                  key={chat.id}
                  name={chat.name}
                  lastMessage={chat.lastMessage}
                />
              );
            })
          )}
        </div>
        <div>
          {loadingMessages ? (
            <p>Loading messages...</p>
          ) : messagesError ? (
            <p>{messagesError}</p>
          ) : (
            <>
              <h2>
                {/* Show the name of the active chat */}
                {chats.filter((chat) => chat.id === activeChatId)[0].name}
              </h2>
              <div>
                {messages.length === 0 ? (
                  <p>No messages yet. Be the first to send a message.</p>
                ) : (
                  messages.map((message) => {
                    return (
                      <Message
                        key={message.id}
                        sender={message.sender.username}
                        text={message.text}
                      />
                    );
                  })
                )}
              </div>
              <div>
                <form>
                  <input
                    type="text"
                    name="message"
                    placeholder="Type message..."
                  />
                  <button type="button">Send</button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      {isNewChatModalOpen && (
        <NewChatModal close={() => setIsNewChatModalOpen(false)} />
      )}
    </>
  );
}

export default ChatPage;
