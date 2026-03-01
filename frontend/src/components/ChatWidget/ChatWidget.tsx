'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ChatWidget.module.css';
import { makeApiRequest, API } from '../../api/api';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi there! I'm the WonderToys Assistant. How can I help you today?",
            sender: 'bot',
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const updateUIstate = (reply: string) => {
        if (reply.includes('[UI_ACTION:CART_UPDATED]')) {
            window.dispatchEvent(new CustomEvent('chat_bot_action', { detail: { reply } }));
        }
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userText = inputValue;

        // Add user message
        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: userText,
            sender: 'user',
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await makeApiRequest(API.SEND_CHAT_MESSAGE, {
                message: userText,
            });

            if (response?.status === 'success' && response?.data?.reply) {
                const rawReply = response.data.reply;
                updateUIstate(rawReply);

                // Remove the secret UI tag before showing it to the user
                const cleanReply = rawReply.replace(/\[UI_ACTION:[^\]]+\]/g, '').trim();

                const botResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: cleanReply,
                    sender: 'bot',
                };
                setMessages((prev) => [...prev, botResponse]);
            } else {
                throw new Error('Invalid response');
            }
        } catch (error) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Sorry, I encountered an error communicating with the server.',
                sender: 'bot',
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    className={styles.fab}
                    onClick={toggleChat}
                    aria-label="Open chat"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={styles.chatWindow}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerTitle}>
                            <span className={styles.onlineIndicator}></span>
                            Chat Support
                        </div>
                        <button
                            className={styles.closeButton}
                            onClick={toggleChat}
                            aria-label="Close chat"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className={styles.messagesContainer}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.userWrapper : styles.botWrapper
                                    }`}
                            >
                                <div
                                    className={`${styles.messageBubble} ${msg.sender === 'user'
                                        ? styles.userBubble
                                        : styles.botBubble
                                        }`}
                                >
                                    {msg.sender === 'bot' ? (
                                        <div className={styles.markdownContent}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className={`${styles.messageWrapper} ${styles.botWrapper}`}>
                                <div className={`${styles.messageBubble} ${styles.botBubble} ${styles.typingIndicator}`}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form className={styles.inputArea} onSubmit={handleSend}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your message..."
                            className={styles.input}
                        />
                        <button
                            type="submit"
                            className={styles.sendButton}
                            disabled={!inputValue.trim() || isLoading}
                            aria-label="Send message"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
