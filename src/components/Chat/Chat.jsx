function Chat({ name, lastMessage }) {
  return (
    <div>
      <span>{name}</span>
      {lastMessage ? (
        <span>
          {lastMessage.sender.username}: {lastMessage.text}
        </span>
      ) : (
        <p>No messages yet.</p>
      )}
    </div>
  );
}

export default Chat;
