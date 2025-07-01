import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, GraduationCap, BookOpen, Users, Calendar, Moon, Sun } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to MJCET.ai! I'm your intelligent college assistant for Muffakham Jah College of Engineering and Technology. I can help you with academic information, course details, campus facilities, admission queries, and much more. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check for saved theme preference or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Update theme in localStorage when changed
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const generateAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('admission') || lowerMessage.includes('apply')) {
      return "For admissions to MJCET, you can visit our admissions office or check our official website. We offer undergraduate and postgraduate programs in Engineering, Technology, and Management. The admission process typically involves entrance exams like JEE Main, EAMCET, or GATE depending on the program. Would you like specific information about any particular course?";
    } else if (lowerMessage.includes('course') || lowerMessage.includes('program') || lowerMessage.includes('branch')) {
      return "MJCET offers various engineering branches including Computer Science, Electronics & Communication, Mechanical, Civil, Electrical, and more. We also have MBA and MCA programs. Each program is designed with industry-relevant curriculum and practical exposure. Which specific course would you like to know more about?";
    } else if (lowerMessage.includes('campus') || lowerMessage.includes('facility') || lowerMessage.includes('hostel')) {
      return "Our campus in Hyderabad features modern laboratories, well-equipped classrooms, a comprehensive library, sports facilities, and comfortable hostel accommodations. We have separate hostels for boys and girls with all necessary amenities. The campus also includes cafeterias, medical facilities, and recreational areas. What specific facility would you like to know about?";
    } else if (lowerMessage.includes('fee') || lowerMessage.includes('cost') || lowerMessage.includes('scholarship')) {
      return "Fee structures vary by program and category. We offer various scholarships and financial aid options for deserving students. Merit-based scholarships, need-based assistance, and government scholarships are available. For detailed fee information and scholarship eligibility, I recommend contacting our accounts office or visiting the college website.";
    } else if (lowerMessage.includes('placement') || lowerMessage.includes('job') || lowerMessage.includes('career')) {
      return "MJCET has an excellent placement record with top companies visiting our campus regularly. Our Training & Placement cell provides career guidance, skill development programs, and placement assistance. Companies like TCS, Infosys, Wipro, Amazon, and many others recruit from our campus. We also focus on entrepreneurship development and higher studies guidance.";
    } else {
      return "That's a great question! I'm here to help you with any information about MJCET - whether it's about academics, admissions, campus life, facilities, or career opportunities. Feel free to ask me anything specific, and I'll provide you with detailed information to help you make informed decisions about your education at MJCET.";
    }
  };

const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    text: inputValue,
    sender: 'user',
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  const currentInput = inputValue;
  setInputValue('');
  setIsTyping(true);

  setTimeout(async () => {
    try {
      const response = await fetch('http://45.11.229.11:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentInput }),
      });
      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "❌ Failed to fetch response from server.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }
    setIsTyping(false);
  }, 1500);
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Header */}
      <div className={`backdrop-blur-md border-b px-6 py-4 sticky top-0 z-10 shadow-sm transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900/90 border-gray-700/50' 
          : 'bg-white/90 border-gray-200/50'
      }`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/public/mjcet.ai.png/download.png" 
                alt="MJCET Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
                  isDarkMode 
                    ? 'from-blue-400 to-indigo-400' 
                    : 'from-blue-700 to-indigo-700'
                }`}>
                  MJCET.ai
                </h1>
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  College AI Assistant
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className={`hidden md:flex items-center space-x-4 text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <div className="flex items-center space-x-1">
                <GraduationCap className="w-4 h-4" />
                <span>Academic Support</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>Course Info</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Online
                </span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-88px)]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 animate-fade-in-up ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {message.sender === 'ai' ? (
                <div className={`p-2.5 rounded-full flex-shrink-0 shadow-md transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                }`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className={`p-2.5 rounded-full flex-shrink-0 shadow-md transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700' 
                    : 'bg-gradient-to-r from-gray-500 to-gray-600'
                }`}>
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`flex-1 min-w-0 ${message.sender === 'user' ? 'flex flex-col items-end' : ''}`}>
                <div
                  className={`inline-block p-4 rounded-2xl max-w-[85%] shadow-sm transition-all duration-300 ${
                    message.sender === 'ai'
                      ? isDarkMode
                        ? 'bg-gray-800/80 backdrop-blur-sm text-gray-100 rounded-tl-md border border-gray-700'
                        : 'bg-white/80 backdrop-blur-sm text-gray-800 rounded-tl-md border border-gray-100'
                      : isDarkMode
                        ? 'bg-gray-700/90 backdrop-blur-sm text-gray-100 rounded-tr-md border border-gray-600 shadow-md'
                        : 'bg-gray-200/90 backdrop-blur-sm text-gray-800 rounded-tr-md border border-gray-300 shadow-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                <p className={`text-xs mt-2 px-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-3 animate-fade-in-up">
              <div className={`p-2.5 rounded-full flex-shrink-0 shadow-md transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600'
              }`}>
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className={`p-4 rounded-2xl rounded-tl-md shadow-sm backdrop-blur-sm transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/80 border border-gray-700' 
                  : 'bg-white/80 border border-gray-100'
              }`}>
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 rounded-full animate-bounce ${
                    isDarkMode ? 'bg-blue-400' : 'bg-blue-400'
                  }`}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${
                    isDarkMode ? 'bg-blue-400' : 'bg-blue-400'
                  }`} style={{ animationDelay: '0.1s' }}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${
                    isDarkMode ? 'bg-blue-400' : 'bg-blue-400'
                  }`} style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-3">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setInputValue('Tell me about admission process')}
              className={`px-4 py-2 backdrop-blur-sm rounded-full text-sm border transition-all duration-200 hover:shadow-sm hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800/70 hover:bg-gray-700/90 text-gray-300 border-gray-600 hover:border-blue-400' 
                  : 'bg-white/70 hover:bg-white/90 text-gray-700 border-gray-200 hover:border-blue-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-1" />
              Admissions
            </button>
            <button
              onClick={() => setInputValue('What courses are available?')}
              className={`px-4 py-2 backdrop-blur-sm rounded-full text-sm border transition-all duration-200 hover:shadow-sm hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800/70 hover:bg-gray-700/90 text-gray-300 border-gray-600 hover:border-blue-400' 
                  : 'bg-white/70 hover:bg-white/90 text-gray-700 border-gray-200 hover:border-blue-300'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-1" />
              Courses
            </button>
            <button
              onClick={() => setInputValue('Tell me about campus facilities')}
              className={`px-4 py-2 backdrop-blur-sm rounded-full text-sm border transition-all duration-200 hover:shadow-sm hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800/70 hover:bg-gray-700/90 text-gray-300 border-gray-600 hover:border-blue-400' 
                  : 'bg-white/70 hover:bg-white/90 text-gray-700 border-gray-200 hover:border-blue-300'
              }`}
            >
              <GraduationCap className="w-4 h-4 inline mr-1" />
              Campus
            </button>
            <button
              onClick={() => setInputValue('What about placements?')}
              className={`px-4 py-2 backdrop-blur-sm rounded-full text-sm border transition-all duration-200 hover:shadow-sm hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800/70 hover:bg-gray-700/90 text-gray-300 border-gray-600 hover:border-blue-400' 
                  : 'bg-white/70 hover:bg-white/90 text-gray-700 border-gray-200 hover:border-blue-300'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Placements
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className={`backdrop-blur-md border-t px-6 py-4 shadow-sm transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-900/90 border-gray-700/50' 
            : 'bg-white/90 border-gray-200/50'
        }`}>
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about MJCET - admissions, courses, campus life, placements..."
                className={`w-full px-4 py-3 pr-12 rounded-xl border focus:ring-2 focus:outline-none transition-all duration-200 backdrop-blur-sm shadow-sm ${
                  isDarkMode 
                    ? 'bg-gray-800/80 border-gray-600 focus:border-blue-400 focus:ring-blue-400/20 text-gray-100 placeholder-gray-400' 
                    : 'bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-200 text-gray-900 placeholder-gray-500'
                }`}
                disabled={isTyping}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex-shrink-0 shadow-md ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-600 disabled:to-gray-700' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500'
              } text-white`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className={`text-xs mt-2 text-center transition-colors duration-300 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(156, 163, 175, 0.5)'};
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? 'rgba(75, 85, 99, 0.8)' : 'rgba(156, 163, 175, 0.8)'};
        }
      `}</style>
    </div>
  );
}

export default App;