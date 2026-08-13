import { useState, useRef, useEffect } from "react";
import "../../assets/css/aichat.css";
import {
    FaPaperPlane,
    FaRobot,
    FaUser,
    FaMicrophone,
    FaPaperclip,
    FaCopy,
    FaThumbsUp,
    FaThumbsDown,
} from "react-icons/fa";

const AIChatPage = () => {

    const quickQuestions = [
        "Sự kiện sắp diễn ra",
        "Điểm rèn luyện của tôi",
        "Tôi đã đăng ký sự kiện nào?",
        "Hướng dẫn điểm danh QR",
        "Gợi ý sự kiện phù hợp"
    ];

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "👋 Xin chào Nguyễn Văn A.\nTôi là AI Assistant của hệ thống quản lý sự kiện sinh viên.\nTôi có thể hỗ trợ tra cứu sự kiện, điểm rèn luyện, đăng ký tham gia và giải đáp các câu hỏi của bạn."
        }
    ]);

    const [input, setInput] = useState("");

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const sendMessage = () => {

        if (!input.trim()) return;

        const userMessage = {
            sender: "user",
            text: input
        };

        setMessages(prev => [...prev, userMessage]);

        setInput("");

        setTimeout(() => {

            setMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text:
                        "Đây là dữ liệu giả của giao diện.\nSau này phản hồi này sẽ được lấy từ FastAPI + AI."
                }
            ]);

        }, 800);

    };

    const quickAsk = (question) => {

        setInput(question);

    };

    return (

        <div className="ai-chat-page">

            <div className="ai-header">

                <div>

                    <h2>

                        🤖 AI Assistant

                    </h2>

                    <p>

                        Hỏi đáp mọi thông tin về sự kiện sinh viên.

                    </p>

                </div>

            </div>

            <div className="quick-question">

                {

                    quickQuestions.map((item, index) => (

                        <button
                            key={index}
                            onClick={() => quickAsk(item)}
                        >

                            {item}

                        </button>

                    ))

                }

            </div>

            <div className="chat-box">

                {

                    messages.map((item, index) => (

                        <div
                            key={index}
                            className={`chat-item ${item.sender}`}
                        >

                            <div className="avatar">

                                {

                                    item.sender === "ai"

                                        ?

                                        <FaRobot />

                                        :

                                        <FaUser />

                                }

                            </div>

                            <div className="message">

                                <p>

                                    {item.text}

                                </p>

                                {

                                    item.sender === "ai" &&

                                    <div className="message-action">

                                        <button>

                                            <FaCopy />

                                        </button>

                                        <button>

                                            <FaThumbsUp />

                                        </button>

                                        <button>

                                            <FaThumbsDown />

                                        </button>

                                    </div>

                                }

                            </div>

                        </div>

                    ))

                }

                <div ref={bottomRef}></div>

            </div>

            <div className="chat-input">

                <button>

                    <FaPaperclip />

                </button>

                <input
                    type="text"
                    placeholder="Nhập câu hỏi..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            sendMessage();

                        }

                    }}
                />

                <button>

                    <FaMicrophone />

                </button>

                <button
                    className="send-btn"
                    onClick={sendMessage}
                >

                    <FaPaperPlane />

                </button>

            </div>

        </div>

    );

};

export default AIChatPage;