import ChatbotIcon from "./Chatboticon"
const ChatMessage = (props) => {
  return (
    !props.chat.hideInChat &&(<div className={`message ${props.chat.role === "model" ? 'bot' : 'user'}-message ${props.chat.isError? "error" : ""}`}>
                {props.chat.role==="model" && <ChatbotIcon/>}
                <p className="message-text">{props.chat.text}</p>
    </div>
  )
)
}

export default ChatMessage
