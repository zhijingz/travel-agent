import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const downloadMessageAsPDF = (content, index) => {
    const element = document.createElement('div');
    element.innerHTML = content;
    element.style.padding = '10px';
    element.style.backgroundColor = '#0c0c1d';
    element.style.color = '#e2e8f0';
    element.style.fontFamily = 'sans-serif';
    
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`message_${index}.pdf`);
    });
  };

function Chat({ agentType, initialMessage, agentInitials, directQuestion }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [processedQuestions, setProcessedQuestions] = useState([]);

  const API_BASE_URL = "http://127.0.0.1:5002";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = useCallback(
    async (questionOverride = null) => {
      const messageToSend = questionOverride || input;

      if (!messageToSend.trim()) return; //empty message

      const userMessage = {
        content: messageToSend,
        isUser: true,
      }; 

      setMessages((prev) => [...prev, userMessage]); //set user message

      if (!questionOverride) {
        setInput("");
      }

      setIsLoading(true);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/${agentType}`,
          {
            message: messageToSend,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );

        if (response.data && response.data.response) {
          setMessages((prev) => [
            ...prev,
            {
              content: response.data.response,
              isUser: false,
            },
          ]);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
          ...prev,
          {
            content:
              "Sorry, there was an error connecting to the AI agent. Please make sure the Flask server is running at http://127.0.0.1:5002/",
            isUser: false,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, agentType, API_BASE_URL]
  );

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const cleanQuestion = (question) => {
    return question.replace(/\s*\[\d+\]\s*$/, "");
  };

  useEffect(() => {
    if (initialMessage) {
      setMessages([
        {
          content: initialMessage,
          isUser: false,
        },
      ]);
    }
  }, [initialMessage]);

  //useEffect(() => {
   // scrollToBottom();
  //}, [messages]);

    useEffect(() => {
    if (
      directQuestion &&
      directQuestion.trim() !== "" &&
      !processedQuestions.includes(directQuestion)
    ) {
      const cleanedQuestion = cleanQuestion(directQuestion);
      setInput(cleanedQuestion);
      handleSendMessage(cleanedQuestion);
      setProcessedQuestions((prev) => [...prev, directQuestion]);
    }
  }, [directQuestion, processedQuestions, handleSendMessage]);

  const renderContent = (content) => {
    let formattedContent = content;

    formattedContent = formattedContent.replace(
      /#{6}\s+(.*?)(?=\n|$)/g,
      "<h6>$1</h6>"
    );
    formattedContent = formattedContent.replace(
      /#{5}\s+(.*?)(?=\n|$)/g,
      "<h5>$1</h5>"
    );
    formattedContent = formattedContent.replace(
      /#{4}\s+(.*?)(?=\n|$)/g,
      "<h4>$1</h4>"
    );
    formattedContent = formattedContent.replace(
      /#{3}\s+(.*?)(?=\n|$)/g,
      "<h3>$1</h3>"
    );
    formattedContent = formattedContent.replace(
      /#{2}\s+(.*?)(?=\n|$)/g,
      "<h2>$1</h2>"
    );
    formattedContent = formattedContent.replace(
      /#{1}\s+(.*?)(?=\n|$)/g,
      "<h1>$1</h1>"
    );

    formattedContent = formattedContent.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    formattedContent = formattedContent.replace(/\*(.*?)\*/g, "<em>$1</em>");

    formattedContent = formattedContent.replace(/`(.*?)`/g, "<code>$1</code>");

    formattedContent = formattedContent.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank">$1</a>'
    );

    formattedContent = formattedContent.replace(
      /^\s*\*\s+(.*?)(?=\n|$)/gm,
      "<li>$1</li>"
    );
    formattedContent = formattedContent.replace(
      /<li>(.*?)<\/li>(?:\s*<li>.*?<\/li>)*/g,
      "<ul>$&</ul>"
    );

    formattedContent = formattedContent.replace(
      /^\s*\d+\.\s+(.*?)(?=\n|$)/gm,
      "<li>$1</li>"
    );
    formattedContent = formattedContent.replace(
      /<li>(.*?)<\/li>(?:\s*<li>.*?<\/li>)*/g,
      "<ol>$&</ol>"
    );

    return { __html: formattedContent };
  };

  return (
  <div className="w-full h-[450px] flex flex-col bg-gray-900 rounded-lg shadow-lg border border-gray-800">
    {/* Chat messages area */}
    <div
      className="flex-1 overflow-y-auto p-6"
      id={`${agentType}-messages`}
      style={{ minHeight: 0 }}
    >
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-6 flex ${message.isUser ? "justify-end" : "justify-start"}`}
        >
          {!message.isUser && (
            <div className="mr-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                {agentInitials || "AI"}
              </div>
            </div>
          )}
          <div className="relative max-w-[70%]">
            <div
              className={`px-3 rounded-lg shadow-sm inline-block align-top break-words ${
                message.isUser
                  ? "bg-blue-600 text-white"
                  : "bg-[#181830] text-gray-200"
              }`}
              style={{
                maxWidth: "100%",
                minWidth: "2.5rem",
                width: "fit-content",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              <div dangerouslySetInnerHTML={renderContent(message.content)} />
            </div>
            {/* Download PDF button for AI messages */}
            {!message.isUser && (
              <button
                className="absolute -bottom-7 right-0 text-xs bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600 shadow-md"
                onClick={() => downloadMessageAsPDF(message.content, index)}
              >
                Download
              </button>
            )}
          </div>
        </div>
      ))}
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-start mb-4">
          <div className="mr-2">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
              {agentInitials || "AI"}
            </div>
          </div>
          <div className="p-3 rounded-lg shadow-sm bg-[#181830] text-gray-200">
            <span className="loading-dots">...</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
    {/* Input area */}
    <div className="p-4 bg-gray-900 border-t border-gray-800">
      <div className="flex">
        <input
          type="text"
          id={`${agentType}-input`}
          className="p-2 flex-1 mr-2 border border-gray-700 rounded bg-[#1818340] text-gray-100"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          id={`${agentType}-send`}
          className="bg-blue-600 text-white rounded px-4 py-2 cursor-pointer hover:bg-blue-800 border-0"
          onClick={() => handleSendMessage()}
        >
          Send
        </button>
      </div>
    </div>
  </div>
);
}
export default Chat;