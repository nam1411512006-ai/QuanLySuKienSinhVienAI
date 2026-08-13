import "../../assets/css/ai.css";
import {
    FaRobot,
    FaComments,
    FaCalendarAlt,
    FaAward,
    FaArrowRight,
    FaCircle,
} from "react-icons/fa";

const AIWidget = () => {
    return (

        <div className="ai-widget">

            <div className="ai-header">

                <div className="ai-avatar">
                    <FaRobot />
                </div>

                <div className="ai-title">

                    <h3>AI Assistant</h3>

                    <span>
                        <FaCircle className="online-dot" />
                        Online
                    </span>

                </div>

            </div>

            <div className="ai-body">

                <h4>Xin chào 👋</h4>

                <p>
                    Tôi có thể hỗ trợ bạn tìm kiếm sự kiện,
                    giải đáp điểm rèn luyện và hướng dẫn đăng ký
                    tham gia nhanh chóng.
                </p>

                <div className="ai-feature">
                    <FaCalendarAlt />
                    <span>Tìm kiếm sự kiện</span>
                </div>

                <div className="ai-feature">
                    <FaAward />
                    <span>Tra cứu điểm rèn luyện</span>
                </div>

                <div className="ai-feature">
                    <FaComments />
                    <span>Giải đáp nhanh 24/7</span>
                </div>

            </div>

            <button className="ai-button">

                Trò chuyện với AI

                <FaArrowRight />

            </button>

        </div>

    );
};

export default AIWidget;