import React, { useState } from 'react';
import { sendMessage } from './services/ChatApi';

const Chat = () => {
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([{ type: 'bot', text: 'I have analyzed the document. Ask me anything!' }]);
    const [awaitingResponse, setAwaitingResponse] = useState(false);

    const handleSendMessage = async () => {
        if (!awaitingResponse && userMessage) {
            // Send the user message to the API
            try {
                // Set user message
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { type: 'user', text: userMessage },
                ]);

                setAwaitingResponse(true);
                const botResponse = await sendMessage(userMessage);

                // Set bot response
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { type: 'bot', text: botResponse },
                ]);

                // Clear the user message input
                setAwaitingResponse(false);
                setUserMessage('');
            } catch (error) {
                console.error('Error sending message:', error.message);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { type: 'bot', text: 'Something went wrong. Please try again' },
                ]);
                setAwaitingResponse(false);
                setUserMessage('');
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen w-[50%]">
            <div className="flex-1 overflow-y-auto container p-4">
                {messages.map((message, index) => (
                    <div key={index} className={message.type === 'user' ? 'text-right' : 'text-left'}>
                        <div className={`p-4 mb-5 inline-block max-w-[60%] break-words ${message.type === 'user' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-black'} rounded-tl-xl rounded-tr-xl ${message.type === 'user' ? 'rounded-bl-xl' : 'rounded-br-xl'}`}>
                            {message.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4">
                <div className="flex">
                    <input
                        type="text"
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message..."
                        value={userMessage}
                        className="flex-1 p-2 border border-gray-300 rounded-l text-black"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="p-2 bg-purple-500 text-white rounded-r"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;