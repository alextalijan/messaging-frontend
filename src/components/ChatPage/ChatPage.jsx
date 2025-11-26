import { useContext, useEffect, useState } from 'react';
import UserContext from '../../contexts/UserContext';
import Chat from '../Chat/Chat';
import Message from '../Message/Message';
import NewChatModal from '../NewChatModal/NewChatModal';
import styles from './ChatPage.module.css';

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [chatsError, setChatsError] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messagesError, setMessagesError] = useState(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [reloadChats, setReloadChats] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [refreshMessages, setRefreshMessages] = useState(false);
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
  }, [reloadChats]);

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
  }, [activeChatId, refreshMessages]);

  function handleInputChange(event) {
    setMessageInput(event.target.value);
  }

  function sendMessage() {
    fetch(import.meta.env.VITE_API + `/chats/${activeChatId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: messageInput,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return alert(json.message);
        }

        setRefreshMessages((prev) => !prev);
        setMessageInput('');
      })
      .catch((err) => alert(err.message));
  }

  return (
    <>
      <h1 className={styles.h1}>Dashboard</h1>
      <div className={styles['dashboard-wrapper']}>
        <div className={styles['chats-section']}>
          <h2 className={styles['chats-heading']}>CHATS</h2>
          <button
            className={styles['new-chat-btn']}
            type="button"
            onClick={() => setIsNewChatModalOpen(true)}
          >
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
                  openChat={() => setActiveChatId(chat.id)}
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
            <div className={styles['chat-wrapper']}>
              <h2 className={styles['chat-heading']}>
                {/* Show the name of the active chat */}
                {chats.filter((chat) => chat.id === activeChatId)[0].name}
              </h2>
              <div className={styles['chat-screen']}>
                {messages.length === 0 ? (
                  <p className={styles['no-messages-msg']}>
                    No messages yet. Be the first to send a message.
                  </p>
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
              <div className={styles['text-box']}>
                <form className={styles['msg-form-wrapper']}>
                  <input
                    type="text"
                    name="message"
                    placeholder="Type message..."
                    className={styles['msg-input']}
                    value={messageInput}
                    onChange={handleInputChange}
                  />
                  <button
                    className={styles['send-msg-btn']}
                    type="button"
                    onClick={sendMessage}
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      {isNewChatModalOpen && (
        <NewChatModal
          close={() => {
            setIsNewChatModalOpen(false);
            setReloadChats((prev) => !prev);
          }}
        />
      )}
    </>
  );
}

export default ChatPage;
