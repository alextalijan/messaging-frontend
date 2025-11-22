function Chat({ name, lastMessage }) {
  return (
    <div>
      <span>{name}</span>
      {lastMessage && (
        <span>
          {lastMessage.sender.username}: {lastMessage.text}
        </span>
      )}
    </div>
  );
}

export default Chat;
