'use client';

import { useEffect, useRef, useState } from 'react';

export default function ChatWidget() {
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);

  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([]);

  // Separate inputs: pill input + panel input
  const [pillInput, setPillInput] = useState('');
  const [chatInput, setChatInput] = useState('');

  const chatInputRef = useRef<HTMLInputElement>(null);

  const closePanel = () => {
    setIsChatPanelOpen(false);
    setIsChatExpanded(false);
  };

  const openPanelAndSend = (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    // Open panel
    setIsChatPanelOpen(true);

    // Push user message into chat
    setChatMessages((prev) => [...prev, { role: 'user', content: trimmed }]);

    // Clear pill input + panel input
    setPillInput('');
    setChatInput('');

    // Focus panel input once opened
    setTimeout(() => chatInputRef.current?.focus(), 250);

    // Fake assistant response (uses the actual message)
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Thanks for your question about "${trimmed.slice(0, 50)}${
            trimmed.length > 50 ? '...' : ''
          }". CredAble's AI engine analyzes multiple data points including cashflows, GST compliance, and counterparty networks to provide instant credit decisions. Would you like to try our live demo?`,
        },
      ]);
    }, 800);
  };

  const sendPanelMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    setChatMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Got it — you said: "${trimmed.slice(0, 60)}${
            trimmed.length > 60 ? '...' : ''
          }". Want me to explain how CredAble would assess that in a credit memo?`,
        },
      ]);
    }, 800);
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
        </div>

        <div className="chat-panel-input">
          <input
            ref={chatInputRef}
            type="text"
            placeholder="Type your message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendPanelMessage();
              }
            }}
          />
          <button className="chat-send-btn" onClick={sendPanelMessage} disabled={!chatInput.trim()}>
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
