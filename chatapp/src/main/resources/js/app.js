import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const client = Stomp.client('ws://localhost:8080/chat');
    client.connect({}, frame => {
      console.log('Connected: ' + frame);
      client.subscribe('/topic/messages', msg => {
        setMessages(prevMessages => [...prevMessages, JSON.parse(msg.body)]);
      });
    });
    setStompClient(client);
  }, []);

  const sendMessage = () => {
    stompClient.send('/app/send', {}, JSON.stringify({ from: 'user', text: message }));
    setMessage('');
  };

  return (
    <div>
      <h1>Chat Application</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.from}: {msg.text}</div>
        ))}
      </div>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default App;
