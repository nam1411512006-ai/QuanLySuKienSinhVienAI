import "./Button.css";

const Button = ({
    children,
    type = "button",
    variant = "primary",
    size = "medium",
    onClick,
    disabled = false,
}) => {
    return (
        <button
            type={type}
            className={`btn btn-${variant} btn-${size}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;