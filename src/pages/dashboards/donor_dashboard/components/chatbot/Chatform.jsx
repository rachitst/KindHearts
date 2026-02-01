import { ArrowUp } from 'lucide-react';
import { useRef } from 'react';



const Chatform = (props) => {
    const inputRef = useRef()
    const handleFormSubmit=(e)=>{
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if(!userMessage) return;
        inputRef.current.value="";
        props.setChatHistory((history)=>[...history,{role :"user",text : userMessage}])
        
        setTimeout(()=>{
            props.setChatHistory((history)=>[...history,{role : "model" ,text :"Thinking...."}]);
            
            props.generateBotResponse([...props.chatHistory,{role:"user",text: `Using the details  provided above,please address this query : ${userMessage}`}]);

        },600);

    }

  return (
    
    <div>
      <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
              <input ref={inputRef} type="text" placeholder="message" className="message-input" required />
              <button className="material-symbols-rounded"><ArrowUp/></button>

            </form>
    </div>
    
  );
};

export default Chatform;
