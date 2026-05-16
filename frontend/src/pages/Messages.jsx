// Messages page - Real-time messaging interface
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import { io } from 'socket.io-client';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize socket connection
    const token = localStorage.getItem('token');
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001', {
      auth: { token }
    });

    setSocket(newSocket);

    // Fetch conversations
    fetchConversations();

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (data) => {
        if (data.conversationId === selectedConversation?._id) {
          setMessages(prev => [...prev, data.message]);
        }
      };

      socket.on('new_message', handleNewMessage);

      // Cleanup: remove listener when component unmounts or dependencies change
      return () => {
        socket.off('new_message', handleNewMessage);
      };
    }
  }, [socket, selectedConversation]);
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find(c => c._id === conversationId);
      if (conv) {
        handleSelectConversation(conv);
      }
    }
  }, [searchParams, conversations]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    
    try {
      const response = await axios.get(`/api/conversations/${conversation._id}/messages`);
      setMessages(response.data);
      
      if (socket) {
        socket.emit('join_conversation', conversation._id);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket || !selectedConversation) return;

    // Send via socket - message will be added via socket event listener
    socket.emit('send_message', {
      conversationId: selectedConversation._id,
      text: newMessage
    });

    setNewMessage('');
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== conversation.participants[0]._id);
  };

  if (loading) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.title}>Conversations</h2>
        {conversations.length === 0 ? (
          <p style={styles.empty}>No conversations yet</p>
        ) : (
          conversations.map(conv => (
            <div
              key={conv._id}
              style={{
                ...styles.conversationItem,
                backgroundColor: selectedConversation?._id === conv._id ? '#ecf0f1' : '#fff'
              }}
              onClick={() => handleSelectConversation(conv)}
            >
              <div style={styles.convInfo}>
                <p style={styles.convTitle}>{conv.listing.title}</p>
                <p style={styles.convParticipant}>
                  {getOtherParticipant(conv)?.name || 'User'}
                </p>
                {conv.lastMessage && (
                  <p style={styles.lastMessage}>{conv.lastMessage}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={styles.chatArea}>
        {selectedConversation ? (
          <>
            <div style={styles.chatHeader}>
              <h3>{selectedConversation.listing.title}</h3>
              <p>{getOtherParticipant(selectedConversation)?.name}</p>
            </div>

            <div style={styles.messagesContainer}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.message,
                    alignSelf: message.sender._id === selectedConversation.participants[0]._id 
                      ? 'flex-end' 
                      : 'flex-start',
                    backgroundColor: message.sender._id === selectedConversation.participants[0]._id 
                      ? '#0d9488' 
                      : '#ffffff',
                    color: message.sender._id === selectedConversation.participants[0]._id 
                      ? '#fff' 
                      : '#134e4a',
                    borderRadius: message.sender._id === selectedConversation.participants[0]._id
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                    border: message.sender._id === selectedConversation.participants[0]._id
                      ? 'none'
                      : '1px solid #e0f2f1'
                  }}
                >
                  <p style={styles.messageText}>{message.text}</p>
                  <p style={styles.messageTime}>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} style={styles.inputForm}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={styles.input}
              />
              <button type="submit" style={styles.sendButton}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div style={styles.emptyChat}>
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 200px)',
    maxWidth: '1200px',
    margin: '2rem auto',
    gap: '1rem',
    padding: '0 1rem'
  },
  sidebar: {
    width: '300px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1rem',
    overflowY: 'auto',
    borderRight: '1px solid #e0f2f1'
  },
  title: {
    marginBottom: '1rem'
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    padding: '2rem'
  },
  conversationItem: {
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    cursor: 'pointer',
    border: '1px solid #e0f2f1',
    transition: 'all 0.2s'
  },
  convInfo: {},
  convTitle: {
    margin: '0 0 0.5rem 0',
    fontWeight: 'bold'
  },
  convParticipant: {
    margin: '0 0 0.5rem 0',
    color: '#666',
    fontSize: '0.9rem'
  },
  lastMessage: {
    margin: 0,
    color: '#888',
    fontSize: '0.85rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#f8fffe',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e0f2f1'
  },
  chatHeader: {
    padding: '1rem',
    borderBottom: '1px solid #e0f2f1',
    backgroundColor: '#ffffff'
  },
  messagesContainer: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  message: {
    maxWidth: '70%',
    padding: '0.75rem 1rem',
    borderRadius: '18px'
  },
  messageText: {
    margin: '0 0 0.25rem 0'
  },
  messageTime: {
    margin: 0,
    fontSize: '0.75rem',
    opacity: 0.7
  },
  inputForm: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem',
    borderTop: '1px solid #e0f2f1',
    backgroundColor: '#ffffff'
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #e0f2f1',
    borderRadius: '8px'
  },
  sendButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0d9488',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s'
  },
  emptyChat: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666'
  }
};

export default Messages;
