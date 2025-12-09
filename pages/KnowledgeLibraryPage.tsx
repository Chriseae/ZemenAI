
import React, { useState, useRef } from 'react';
import { 
    BookOpenIcon, SearchIcon, PinIcon, ArchiveIcon, TrashIcon, FileIcon, EyeIcon, 
    PlusIcon, CloudUploadIcon, XCircleIcon, LoadingIcon, CheckCircleIcon, 
    ExclamationIcon, RefreshIcon, ImageIcon, AudioIcon, VideoIcon, DownloadIcon 
} from '../components/Icons';
import { LibraryItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// Mock data
const mockLibraryItems: LibraryItem[] = [
  { id: '1', title: 'የኢትዮጵያ ታሪክ ማስታወሻ', type: 'document', date: 'Oct 24, 2023', tags: ['History', 'Ethiopia'], isPinned: true },
  { id: '2', title: 'Quantum Physics Summary', type: 'summary', date: 'Nov 12, 2023', tags: ['Physics', 'Science'], isPinned: false },
  { id: '3', title: 'Adwa Victory Article', type: 'article', date: 'Dec 01, 2023', tags: ['History', 'Adwa'], isPinned: false },
  { id: '4', title: 'Amharic Grammar Rules', type: 'document', date: 'Jan 15, 2024', tags: ['Language', 'Education'], isPinned: true },
];

interface UploadFile {
    id: string;
    file: File;
    status: 'waiting' | 'uploading' | 'processing' | 'training' | 'complete' | 'failed';
    progress: number;
    error?: string;
}

const KnowledgeLibraryPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'documents' | 'articles' | 'summaries'>('all');
  const [items, setItems] = useState<LibraryItem[]>(mockLibraryItems);
  const [uploadQueue, setUploadQueue] = useState<UploadFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fontClass = language === 'am' ? 'font-amharic' : '';

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || item.type + 's' === activeTab || (activeTab === 'summaries' && item.type === 'summary');
    return matchesSearch && matchesTab;
  });

  const handleDelete = (id: string) => {
    if (window.confirm(t('library.actions.deleteConfirm'))) {
        setItems(prev => prev.filter(i => i.id !== id));
    }
  }

  const handlePin = (id: string) => {
      setItems(prev => prev.map(item => {
          if (item.id === id) {
              const newPinnedState = !item.isPinned;
              return { ...item, isPinned: newPinnedState };
          }
          return item;
      }));
  }

  const handleOpen = (item: LibraryItem) => {
      // For mock items with no URL, just show alert
      if (!item.url) {
        alert(`${t('library.actions.open')}: ${item.title}`); 
      } else {
        window.open(item.url, '_blank');
      }
  }

  const handleDownload = (item: LibraryItem) => {
    if (item.url) {
      const a = document.createElement('a');
      a.href = item.url;
      a.download = item.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("Mock item download not available. Upload a real file to test download.");
    }
  }

  // File Upload Logic
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const files: File[] = Array.from(e.target.files);
          const newUploads: UploadFile[] = files.map(file => ({
              id: Math.random().toString(36).substr(2, 9),
              file: file,
              status: 'waiting',
              progress: 0
          }));
          
          setUploadQueue(prev => [...prev, ...newUploads]);
          
          // Trigger pipeline for new files
          newUploads.forEach(upload => simulatePipeline(upload.id));

          if (fileInputRef.current) fileInputRef.current.value = '';
      }
  }

  const simulatePipeline = async (id: string) => {
      // Helper to update status
      const update = (partial: Partial<UploadFile>) => {
          setUploadQueue(prev => prev.map(u => u.id === id ? { ...u, ...partial } : u));
      };

      try {
          // 1. Uploading
          update({ status: 'uploading', progress: 0 });
          for (let i = 0; i <= 100; i += 20) {
              await new Promise(r => setTimeout(r, 200));
              update({ progress: i });
          }

          // 2. Processing
          update({ status: 'processing' });
          await new Promise(r => setTimeout(r, 1500));

          // 3. Training
          update({ status: 'training' });
          await new Promise(r => setTimeout(r, 2500));

          // 4. Complete
          update({ status: 'complete', progress: 100 });
          
          // Add to Library Items mock
          setUploadQueue(prev => {
              const completed = prev.find(u => u.id === id);
              if (completed) {
                  // Create object URL for download
                  const fileUrl = URL.createObjectURL(completed.file);

                  const newItem: LibraryItem = {
                      id: completed.id,
                      title: completed.file.name,
                      type: 'document',
                      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                      tags: ['User Upload'],
                      isPinned: false,
                      url: fileUrl
                  };
                  setItems(prevItems => [newItem, ...prevItems]);
              }
              return prev; // Return updated state
          });

      } catch (e) {
          update({ status: 'failed', error: 'Generic error' });
      }
  }

  const removeUpload = (id: string) => {
      setUploadQueue(prev => prev.filter(u => u.id !== id));
  }

  const getFileIcon = (file: File) => {
      const type = file.type;
      if (type.includes('image')) return <ImageIcon className="w-5 h-5 text-blue-400" />;
      if (type.includes('audio')) return <AudioIcon className="w-5 h-5 text-purple-400" />;
      if (type.includes('video')) return <VideoIcon className="w-5 h-5 text-red-400" />;
      return <FileIcon className="w-5 h-5 text-gray-400" />;
  }

  const getStatusLabel = (status: UploadFile['status']) => {
      return t(`library.upload.status.${status}`);
  }

  const tabKeys = ['all', 'documents', 'articles', 'summaries'] as const;

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-6">
      <header className="mb-6 flex justify-between items-start">
        <div>
            <div className="flex items-center gap-3 mb-2">
            <BookOpenIcon className="w-8 h-8 text-blue-500" />
            <h1 className={`text-3xl font-bold text-gray-100 ${fontClass}`}>{t('library.title')}</h1>
            </div>
            <p className={`text-gray-400 ${fontClass}`}>{t('library.description')}</p>
        </div>
        
        {/* Top accessible upload button */}
        <button 
            onClick={() => fileInputRef.current?.click()}
            className={`hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-md ${fontClass}`}
        >
            <CloudUploadIcon className="w-5 h-5" />
            {t('library.upload.buttonLabel')}
        </button>
      </header>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
          <div className="mb-6 space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Training Queue</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {uploadQueue.map(upload => (
                      <div key={upload.id} className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex flex-col gap-2 relative group">
                          <button 
                              onClick={() => removeUpload(upload.id)}
                              className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              title={t('library.actions.delete')}
                          >
                              <XCircleIcon className="w-4 h-4" />
                          </button>
                          
                          <div className="flex items-center gap-3">
                              {getFileIcon(upload.file)}
                              <span className="text-sm text-gray-200 font-medium truncate flex-1" title={upload.file.name}>{upload.file.name}</span>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                                {upload.status === 'complete' ? (
                                    <CheckCircleIcon className="w-4 h-4 text-green-500" filled />
                                ) : upload.status === 'failed' ? (
                                    <ExclamationIcon className="w-4 h-4 text-red-500" />
                                ) : (
                                    <LoadingIcon className="w-4 h-4 text-blue-500" />
                                )}
                                <span className={`text-xs ${upload.status === 'failed' ? 'text-red-400' : 'text-gray-400'} ${fontClass}`}>
                                    {getStatusLabel(upload.status)}
                                </span>
                          </div>
                          
                          {/* Progress Bar */}
                          {upload.status !== 'complete' && upload.status !== 'failed' && (
                              <div className="w-full bg-gray-700 rounded-full h-1 mt-1 overflow-hidden">
                                  <div 
                                    className="bg-blue-500 h-1 transition-all duration-300" 
                                    style={{ width: `${Math.max(5, upload.progress)}%` }}
                                  ></div>
                              </div>
                          )}

                          {/* Retry Button */}
                          {upload.status === 'failed' && (
                              <button 
                                onClick={() => simulatePipeline(upload.id)}
                                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1 self-start"
                              >
                                  <RefreshIcon className="w-3 h-3" />
                                  {t('library.upload.error.retry')}
                              </button>
                          )}
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
        <div className="relative w-full md:w-96">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder={t('library.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 ${fontClass}`}
            />
        </div>
        <div className="flex gap-2 p-1 bg-gray-800 rounded-lg overflow-x-auto max-w-full">
           {tabKeys.map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${fontClass} ${
                 activeTab === tab ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
               }`}
             >
               {t(`library.tabs.${tab}`)}
             </button>
           ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-8 min-h-[200px]">
        {filteredItems.map(item => (
            <div key={item.id} className="group bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-all shadow-sm hover:shadow-md flex flex-col h-48 relative">
                <div className="flex justify-between items-start mb-3">
                   <div className="p-2 bg-gray-700/50 rounded-lg text-blue-400">
                      <FileIcon className="w-6 h-6" />
                   </div>
                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 bg-gray-800/90 rounded-lg p-1 border border-gray-700 z-10">
                      <button 
                        onClick={() => handleOpen(item)}
                        className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-blue-400" 
                        title={t('library.actions.open')}
                      >
                          <EyeIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDownload(item)}
                        className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-green-400" 
                        title={t('library.actions.download')}
                      >
                          <DownloadIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handlePin(item.id)}
                        className={`p-1.5 hover:bg-gray-700 rounded transition-colors ${item.isPinned ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`} 
                        title={t('library.actions.pin')}
                      >
                          <PinIcon className="w-4 h-4" filled={item.isPinned} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400" 
                        title={t('library.actions.delete')}
                      >
                          <TrashIcon className="w-4 h-4" />
                      </button>
                   </div>
                   {/* Persistent Pin Indicator if Pinned */}
                   {item.isPinned && (
                       <div className="absolute top-5 right-5 text-blue-500 group-hover:opacity-0 transition-opacity">
                           <PinIcon className="w-3.5 h-3.5" filled />
                       </div>
                   )}
                </div>
                <h3 
                    onClick={() => handleOpen(item)}
                    className={`font-semibold text-lg text-gray-200 mb-1 line-clamp-2 cursor-pointer hover:text-blue-400 transition-colors ${fontClass}`}
                >
                    {item.title}
                </h3>
                <p className="text-xs text-gray-500 uppercase mb-auto">{item.type} • {item.date}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">{tag}</span>
                    ))}
                </div>
            </div>
        ))}
      </div>
      
      {/* Empty State with Centered Upload */}
      {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
              {/* Circular Add Button for Empty State */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105 mb-6 group"
                title={t('library.upload.buttonLabel')}
              >
                  <PlusIcon className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-200" />
              </button>
              
              <div className={`text-gray-500 ${fontClass}`}>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">{t('library.emptyState')}</h3>
                  <p className="max-w-xs mx-auto text-sm">{t('library.upload.dropLabel')}</p>
              </div>
          </div>
      )}

      {/* Hidden File Input */}
      <input 
        type="file" 
        multiple
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.mp3,.wav,.mp4,.mov,.zip,.csv,.json,.xml"
      />
    </div>
  );
};

export default KnowledgeLibraryPage;
