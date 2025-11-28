import { useContext, useEffect, useState, useRef } from 'react';
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
  const chatPage = useRef(0);
  const chatBottom = useRef(null);
  const chatTop = useRef(null);

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

    // Restart the page number since the chat was changed
    chatPage.current = 0;

    fetch(
      import.meta.env.VITE_API +
        `/chats/${activeChatId}?page=${chatPage.current}`,
      {
        credentials: 'include',
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return setMessagesError(response.message);
        }

        setMessages(response.messages);
        chatPage.current += 1;
      })
      .catch((err) => {
        setMessagesError(err.message);
      })
      .finally(() => {
        setLoadingMessages(false);
      });
  }, [activeChatId, refreshMessages]);

  // When the messages from the new chat are loaded, scroll to the bottom
  useEffect(() => {
    if (messages.length > 0 && messages.length <= 20) {
      chatBottom.current.scrollIntoView();
    }
  }, [messages]);

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

  function handleLoadingMessages(event) {
    // If it is scrolled to the top
    if (event.target.scrollTop === 0) {
      // Load new messages
      loadMoreMessages();
    }
  }

  function loadMoreMessages() {
    fetch(
      import.meta.env.VITE_API +
        `/chats/${activeChatId}?page=${chatPage.current}`,
      {
        credentials: 'include',
      }
    )
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return alert(json.message);
        }

        // If there are any more messages
        if (json.messages.length > 0) {
          // Increment the current page and load new messages
          chatPage.current += 1;
          setMessages((prev) => [...json.messages, ...prev]);
        }
      });
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
        <div className={styles['chat-wrapper']}>
          {loadingMessages ? (
            <p>Loading messages...</p>
          ) : messagesError ? (
            <p>{messagesError}</p>
          ) : (
            <>
              <h2 className={styles['chat-heading']}>
                {/* Show the name of the active chat */}
                {chats.filter((chat) => chat.id === activeChatId)[0].name}
              </h2>
              <div
                className={styles['chat-screen']}
                onScroll={handleLoadingMessages}
              >
                {messages.length === 0 ? (
                  <p className={styles['no-messages-msg']}>
                    No messages yet. Be the first to send a message.
                  </p>
                ) : (
                  messages.map((message, index, messages) => {
                    return (
                      <Message
                        key={message.id}
                        sender={message.sender.username}
                        text={message.text}
                        // If it's the last message or the next message
                        // is not from the same person, display the name
                        // of the sender.
                        anotherMessage={
                          messages.length === index + 1 ||
                          message.sender.username !==
                            messages[index + 1].sender.username
                            ? false
                            : true
                        }
                        ref={
                          messages.length === index + 1
                            ? chatBottom
                            : index === 0
                            ? chatTop
                            : null
                        }
                      />
                    );
                  })
                )}
              </div>
              <form className={styles['msg-form-wrapper']}>
                <textarea
                  type="text"
                  name="message"
                  className={styles['msg-input']}
                  onChange={handleInputChange}
                  value={messageInput}
                ></textarea>
                <button
                  className={styles['send-msg-btn']}
                  type="button"
                  onClick={sendMessage}
                  disabled={messageInput === ''}
                >
                  Send
                </button>
              </form>
            </>
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
