import React, { useState, useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import { useZemenaiChat } from '../hooks/useZemenaiChat';
import { ZemenaiIcon } from '../components/Icons';
import { useLanguage } from '../contexts/LanguageContext';

// Icons
const CodeIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const ImageIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SplitIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4H5a2 2 0 00-2 2v12a2 2 0 002 2h4m10-2V6a2 2 0 00-2-2h-4m5 13V9m0 0L9 9" />
  </svg>
);

const ChevronDownIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const PlayIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DownloadIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const CopyIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

// AI Model configurations
const AI_MODELS = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Ultra-fast responses',
    icon: '⚡',
    color: 'text-yellow-400'
  },
  {
    id: 'gemini-3.0-pro',
    name: 'Gemini 3.0 Pro',
    description: 'Advanced reasoning',
    icon: '🧠',
    color: 'text-purple-400'
  },
  {
    id: 'zemen-llm',
    name: 'Zemen LLM',
    description: 'Specialized Amharic model',
    icon: '🇪🇹',
    color: 'text-green-400'
  },
  {
    id: 'zemenai-beta',
    name: 'ZemenAI Beta',
    description: 'Powered by Gemini 2.0 Flash - Multimodal',
    icon: '✨',
    color: 'text-blue-400'
  }
];

const LiveTranscript: React.FC<{ user: string; assistant: string }> = ({ user, assistant }) => (
  <div className="space-y-4 mb-4 animate-pulse">
    {user && (
      <div className="flex justify-end">
        <div className="max-w-2xl p-4 rounded-2xl shadow-md bg-blue-600/80 text-white/90 rounded-br-none">
          <p className="whitespace-pre-wrap font-amharic leading-relaxed">{user}</p>
        </div>
      </div>
    )}
    {assistant && (
      <div className="flex justify-start">
        <div className="max-w-2xl p-4 rounded-2xl shadow-md bg-gray-800/80 text-gray-200/90 rounded-bl-none">
          <p className="whitespace-pre-wrap font-amharic leading-relaxed">{assistant}</p>
        </div>
      </div>
    )}
  </div>
);

// Model Selector Dropdown
const ModelSelector: React.FC<{
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}> = ({ selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentModel = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
      >
        <span className="text-lg">{currentModel.icon}</span>
        <span className="hidden md:inline">{currentModel.name}</span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-20">
            {AI_MODELS.map(model => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-start gap-3"
              >
                <span className="text-2xl">{model.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{model.name}</span>
                    {selectedModel === model.id && (
                      <CheckIcon className="text-blue-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{model.description}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Enhanced Canvas
const Canvas: React.FC<{
  type: 'code' | 'image' | null;
  content: string;
  onRun?: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
}> = ({ type, content, onRun, onDownload, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!type) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <SplitIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="font-amharic">Canvas ready for code or image display</p>
          <p className="text-sm text-gray-600 mt-2 font-amharic">
            Generated content will appear here
          </p>
        </div>
      </div>
    );
  }

  if (type === 'code') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-2 bg-gray-950 border-b border-gray-800">
          <span className="text-xs text-gray-400 font-mono">JavaScript</span>
          <div className="flex gap-1">
            {onRun && (
              <button
                onClick={onRun}
                className="p-1.5 rounded hover:bg-gray-800 transition-colors"
                title="Run code"
              >
                <PlayIcon className="text-green-400" />
              </button>
            )}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-gray-800 transition-colors"
              title="Copy code"
            >
              <CopyIcon />
            </button>
            {copied && (
              <span className="text-xs text-green-400 px-2 py-1">Copied!</span>
            )}
          </div>
        </div>
        <pre className="flex-1 bg-gray-950 text-green-400 p-4 font-mono text-sm overflow-auto">
          {content}
        </pre>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 bg-gray-950 border-b border-gray-800">
        <span className="text-xs text-gray-400">Generated Image</span>
        <div className="flex gap-1">
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-1.5 rounded hover:bg-gray-800 transition-colors"
              title="Download image"
            >
              <DownloadIcon />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-900">
        <img
          src={content}
          alt="Generated content"
          className="max-w-full max-h-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

const ChatPage: React.FC = () => {
  const {
    messages,
    input,
    isLoading,
    error,
    handleInputChange,
    sendMessage,
    sessions,
    activeSessionId,
    liveState,
    toggleLiveConversation
  } = useZemenaiChat();

  const { t, language } = useLanguage();
  const fontClass = language === 'am' ? 'font-amharic' : '';

  const [splitViewActive, setSplitViewActive] = useState(false);
  const [canvasContent, setCanvasContent] = useState<{ type: 'code' | 'image', content: string } | null>(null);
  const [selectedModel, setSelectedModel] = useState('zemenai-beta');

  useEffect(() => {
    const savedModel = localStorage.getItem('zemenai-selected-model');
    if (savedModel) {
      setSelectedModel(savedModel);
    }
  }, []);

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem('zemenai-selected-model', modelId);
  };

  if (sessions.length === 0 || !activeSessionId) {
    return (
      <div className="flex flex-col h-full w-full max-w-4xl mx-auto items-center justify-center text-center">
        <ZemenaiIcon className="text-4xl" />
        <h2 className={`text-2xl font-bold text-gray-400 mt-4 ${fontClass}`}>{t('chat.welcomeTitle')}</h2>
        <p className={`text-gray-500 ${fontClass}`}>
          {t('chat.welcomeSubtitle')}
        </p>
      </div>
    );
  }

  const hasLiveTranscript = liveState.userTranscript || liveState.assistantTranscript;
  const currentModel = AI_MODELS.find(m => m.id === selectedModel);

  const toggleSplitView = () => {
    setSplitViewActive(!splitViewActive);
    if (!splitViewActive) {
      setCanvasContent({
        type: 'code',
        content: `// ZemenAI Code Generator
// Model: ${currentModel?.name}

function greet(name) {
  return \`ሰላም \${name}! Welcome to ZemenAI\`;
}

console.log(greet("Ethiopia"));

const calculateSum = (arr) => {
  return arr.reduce((sum, num) => sum + num, 0);
};

const numbers = [1, 2, 3, 4, 5];
console.log("Sum:", calculateSum(numbers));`
      });
    }
  };

  const handleCopyChat = () => {
    const chatText = messages.map(m => `${m.role === 'user' ? 'You' : 'Assistant'}: ${m.content}`).join('\n\n');
    navigator.clipboard.writeText(chatText);
  };

  const handleCopyCode = () => {
    if (canvasContent?.content) {
      navigator.clipboard.writeText(canvasContent.content);
    }
  };

  const handleRunCode = () => {
    console.log('Running code:', canvasContent?.content);
    alert('Code execution simulated! Check console for output.');
  };

  const handleDownloadImage = () => {
    if (canvasContent?.content) {
      const link = document.createElement('a');
      link.href = canvasContent.content;
      link.download = 'zemenai-generated-image.png';
      link.click();
    }
  };

  return (
    <div className="flex flex-col h-full w-full mx-auto">
      <header className="p-4 border-b border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
          />
          {currentModel && (
            <span className={`text-xs ${currentModel.color} hidden lg:inline`}>
              {currentModel.description}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            title="Refresh"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={handleCopyChat}
            className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            Copy
          </button>
          <button
            onClick={toggleSplitView}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${splitViewActive ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-gray-800'
              }`}
          >
            Publish
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex flex-col transition-all duration-300 ${splitViewActive ? 'w-1/2 border-r border-gray-700/50' : 'w-full'}`}>
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className={splitViewActive ? '' : 'max-w-4xl mx-auto'}>
              <ChatWindow messages={messages} />
              {hasLiveTranscript && (
                <LiveTranscript user={liveState.userTranscript} assistant={liveState.assistantTranscript} />
              )}
            </div>
          </div>

          <div className="p-4 md:p-6 bg-gray-900">
            <div className={splitViewActive ? '' : 'max-w-4xl mx-auto'}>
              {error && (
                <div className="mb-2 p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm">
                  <strong>{t('common.error')}:</strong> {error.message}
                </div>
              )}
              {liveState.error && (
                <div className="mb-2 p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm">
                  <strong>{t('chat.liveError')}:</strong> {liveState.error}
                </div>
              )}
              <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                sendMessage={sendMessage}
                isLoading={isLoading}
                isLiveActive={liveState.isActive}
                isLiveConnecting={liveState.isConnecting}
                toggleLive={toggleLiveConversation}
              />
              <p className={`text-center text-xs text-gray-500 mt-3 ${fontClass}`}>
                {t('chat.disclaimer')}
              </p>
            </div>
          </div>
        </div>

        {splitViewActive && (
          <div className="w-1/2 flex flex-col bg-gray-900">
            <div className="bg-gray-950 border-b border-gray-800 p-4 flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${fontClass}`}>Canvas</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCanvasContent({
                    type: 'code',
                    content: `// ${currentModel?.name} Code Generation

function calculateFibonacci(n) {
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

console.log("የፊቦናቺ ቅደም ተከተል:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${calculateFibonacci(i)}\`);
}`
                  })}
                  className={`p-2 rounded-lg transition-colors ${canvasContent?.type === 'code' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
                    }`}
                  title="Show code"
                >
                  <CodeIcon />
                </button>
                <button
                  onClick={() => setCanvasContent({
                    type: 'image',
                    content: 'https://via.placeholder.com/800x600/1f2937/10b981?text=ZemenAI+Image+Generation'
                  })}
                  className={`p-2 rounded-lg transition-colors ${canvasContent?.type === 'image' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
                    }`}
                  title="Show image"
                >
                  <ImageIcon />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <Canvas
                type={canvasContent?.type || null}
                content={canvasContent?.content || ''}
                onRun={canvasContent?.type === 'code' ? handleRunCode : undefined}
                onCopy={canvasContent?.type === 'code' ? handleCopyCode : undefined}
                onDownload={canvasContent?.type === 'image' ? handleDownloadImage : undefined}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;