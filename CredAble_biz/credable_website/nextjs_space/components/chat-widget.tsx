'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || 'https://credable-chatbot.onrender.com/chat';
const CHAT_API_KEY = process.env.NEXT_PUBLIC_CHAT_API_KEY;

export default function ChatWidget() {
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);

  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([]);

  // Separate inputs: pill input + panel input
  const [pillInput, setPillInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatInputRef = useRef<HTMLInputElement>(null);

  const closePanel = () => {
    setIsChatPanelOpen(false);
    setIsChatExpanded(false);
  };

  const sendToChatbot = useCallback(
    async (
      userMessage: string,
      messages: { role: 'user' | 'assistant'; content: string }[]
    ) => {
      // Convert to API format: [ ["User question 1", "Assistant answer 1"], ... ]
      const history: [string, string][] = [];
      for (let i = 0; i + 1 < messages.length; i += 2) {
        if (messages[i].role === 'user' && messages[i + 1].role === 'assistant') {
          history.push([messages[i].content, messages[i + 1].content]);
        }
      }

      setIsLoading(true);
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(CHAT_API_KEY && { 'X-API-Key': CHAT_API_KEY }),
        };

        const res = await fetch(CHAT_API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify({ message: userMessage, history }),
        });

        if (!res.ok) {
          throw new Error(`Chat API error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json().catch(() => ({}));
        const reply =
          (typeof data === 'string' ? data : null) ||
          data?.response ||
          data?.reply ||
          data?.answer ||
          data?.message ||
          'Sorry, I couldn\'t get a response from the chatbot.';

        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', content: String(reply) },
        ]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Unable to reach the chatbot (${CHAT_API_URL}). Please ensure it's running locally. Error: ${msg}`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const openPanelAndSend = (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setIsChatPanelOpen(true);
    setChatMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setPillInput('');
    setChatInput('');
    setTimeout(() => chatInputRef.current?.focus(), 250);

    sendToChatbot(trimmed, chatMessages);
  };

  const sendPanelMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    setChatMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setChatInput('');
    sendToChatbot(trimmed, chatMessages);
  };

  // If user closes panel, keep pill collapsed
  useEffect(() => {
    if (!isChatPanelOpen) setIsChatExpanded(false);
  }, [isChatPanelOpen]);

  return (
    <>
      {/* Floating Chat Pill (HIDE when panel is open) */}
      {!isChatPanelOpen && (
        <div className={`chat-pill ${isChatExpanded ? 'chat-pill-expanded' : ''}`}>
          <input
            className="chat-pill-input"
            placeholder="Ask CredAble"
            value={pillInput}
            onFocus={() => setIsChatExpanded(true)}
            onChange={(e) => {
              setPillInput(e.target.value);
              if (!isChatExpanded) setIsChatExpanded(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                openPanelAndSend(pillInput);
              }
            }}
          />

          <button
            className="chat-pill-send"
            onMouseDown={(e) => {
              // Prevent input blur before click fires
              e.preventDefault();
            }}
            onClick={() => openPanelAndSend(pillInput)}
            aria-label="Send and open chat"
            disabled={!pillInput.trim()}
            title={!pillInput.trim() ? 'Type a message first' : 'Send'}
          >
            ↑
          </button>
        </div>
      )}

      {/* Side Panel Chat Interface */}
      <div
        className={`chat-panel-overlay ${isChatPanelOpen ? 'open' : ''}`}
        onClick={closePanel}
      />

      <div className={`chat-panel ${isChatPanelOpen ? 'open' : ''}`}>
        <div className="chat-panel-header">
          <div className="chat-panel-title">
            <div className="chat-panel-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a10 10 0 0 1-10-10A10 10 0 0 1 12 2z" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <div>
              <h3>CredAble AI</h3>
              <span className="chat-panel-status">Online</span>
            </div>
          </div>

          <button className="chat-panel-close" onClick={closePanel}>
            ✕
          </button>
        </div>

        <div className="chat-panel-messages">
          {chatMessages.length === 0 && (
            <div className="chat-welcome">
              <div className="chat-welcome-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h4>Welcome to CredAble AI</h4>
              <p>Ask me anything about credit analysis, supply chain finance, or our AI capabilities.</p>

              <div className="chat-suggestions">
                <button
                  onClick={() => {
                    const msg = 'How does CredAble analyze creditworthiness?';
                    setChatInput(msg);
                    chatInputRef.current?.focus();
                  }}
                >
                  How does credit analysis work?
                </button>

                <button
                  onClick={() => {
                    const msg = 'What is supply chain finance?';
                    setChatInput(msg);
                    chatInputRef.current?.focus();
                  }}
                >
                  What is supply chain finance?
                </button>

                <button
                  onClick={() => {
                    const msg = 'Explain the AI decision process';
                    setChatInput(msg);
                    chatInputRef.current?.focus();
                  }}
                >
                  Explain AI decisions
                </button>
              </div>
            </div>
          )}

          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="chat-message-avatar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
              )}
              <div className="chat-message-content">{msg.content}</div>
            </div>
          ))}

          {isLoading && (
            <div className="chat-message assistant">
              <div className="chat-message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div className="chat-message-content chat-loading">
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
              </div>
            </div>
          )}
        </div>

        <div className="chat-panel-input">
          <input
            ref={chatInputRef}
            type="text"
            placeholder="Type your message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                e.preventDefault();
                sendPanelMessage();
              }
            }}
            disabled={isLoading}
          />
          <button
            className="chat-send-btn"
            onClick={sendPanelMessage}
            disabled={!chatInput.trim() || isLoading}
            title={isLoading ? 'Waiting for response...' : undefined}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
