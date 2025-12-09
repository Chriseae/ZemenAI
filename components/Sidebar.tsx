
import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, SettingsIcon, XIcon, ZemenaiIcon, ChatBubbleIcon, BookOpenIcon, FolderIcon, ThreeDotsIcon, WalletIcon, GiftIcon } from './Icons';
import { useZemenaiChat } from '../hooks/useZemenaiChat';
import { useLanguage } from '../contexts/LanguageContext';
import type { View } from '../App';

interface SidebarProps {
  closeSidebar: () => void;
  activeView: View;
  setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar, activeView, setActiveView }) => {
  const { sessions, activeSessionId, createNewSession, switchSession, deleteSession, renameSession } = useZemenaiChat();
  const { t, language, changeLanguage, availableLanguages } = useLanguage();
  
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenFor(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  useEffect(() => {
    if (renamingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renamingId]);


  const handleNewChat = () => {
    createNewSession();
    setActiveView('chat');
    closeSidebar();
  }

  const handleSwitchChat = (id: string) => {
    if (renamingId !== id) {
      switchSession(id);
      setActiveView('chat');
      closeSidebar();
    }
  }

  const handleViewChange = (view: View) => {
    setActiveView(view);
    closeSidebar();
  };
  
  const handleDeleteChat = (id: string) => {
    if (window.confirm(t('sidebar.deleteConfirm'))) {
      deleteSession(id);
    }
    setMenuOpenFor(null);
  };

  const handleRenameStart = (session: typeof sessions[0]) => {
    setRenamingId(session.id);
    setRenameValue(session.title);
    setMenuOpenFor(null);
  }

  const handleRenameSubmit = () => {
    if (renamingId) {
      renameSession(renamingId, renameValue);
    }
    setRenamingId(null);
  }

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setRenamingId(null);
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-950 text-gray-200 border-r border-gray-800">
      <div className="relative p-4 flex justify-center items-center border-b border-gray-800">
        <button onClick={() => setActiveView('landing')} className="hover:opacity-80 transition-opacity">
           <ZemenaiIcon className="text-3xl"/>
        </button>
        <button onClick={closeSidebar} className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-800">
          <XIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="p-4">
        <button 
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon className="h-5 w-5" />
          <span className={`font-medium ${language === 'am' ? 'font-amharic' : ''}`}>{t('sidebar.newChat')}</span>
        </button>
      </div>

      <div className="px-4 py-2 space-y-1 border-b border-gray-800 mb-2">
         <button 
            onClick={() => handleViewChange('library')} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-left ${activeView === 'library' ? 'bg-gray-800' : ''}`}
          >
            <BookOpenIcon className="h-5 w-5 text-gray-400" />
            <span className={`font-medium ${language === 'am' ? 'font-amharic' : ''}`}>{t('sidebar.library')}</span>
        </button>
        <button 
            onClick={() => handleViewChange('projects')} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-left ${activeView === 'projects' ? 'bg-gray-800' : ''}`}
        >
            <FolderIcon className="h-5 w-5 text-gray-400" />
            <span className={`font-medium ${language === 'am' ? 'font-amharic' : ''}`}>{t('sidebar.projects')}</span>
        </button>
        
        {/* Legacy Wallet Section - Title Removed */}
        <div className="pt-4 pb-1">
            <button 
                onClick={() => handleViewChange('wallet')} 
                className={`w-full flex items-center gap-3 px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-left ${activeView === 'wallet' ? 'bg-gray-800' : ''}`}
            >
                <WalletIcon className="h-5 w-5 text-gray-400" />
                <span className={`font-medium ${language === 'am' ? 'font-amharic' : ''}`}>{t('sidebar.wallet')}</span>
            </button>
            <button 
                onClick={() => handleViewChange('referrals')} 
                className={`w-full flex items-center gap-3 px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-left ${activeView === 'referrals' ? 'bg-gray-800' : ''}`}
            >
                <GiftIcon className="h-5 w-5 text-gray-400" />
                <span className={`font-medium ${language === 'am' ? 'font-amharic' : ''}`}>{t('sidebar.referrals')}</span>
            </button>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
         <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('sidebar.recent')}</p>
         {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => handleSwitchChat(session.id)}
            className={`group relative flex items-center justify-between gap-2 px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer ${
              session.id === activeSessionId && activeView === 'chat' ? 'bg-gray-800' : ''
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden flex-1">
                <ChatBubbleIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                {renamingId === session.id ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={handleRenameSubmit}
                    onKeyDown={handleRenameKeyDown}
                    className="bg-gray-700 text-white text-sm p-0.5 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <span className="font-medium text-sm truncate">{session.title}</span>
                )}
            </div>
            {renamingId !== session.id && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenFor(menuOpenFor === session.id ? null : session.id);
                  }}
                  className="p-1 rounded-md text-gray-500 hover:text-gray-200 hover:bg-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Chat options"
                >
                  <ThreeDotsIcon className="h-4 w-4" />
                </button>
                {menuOpenFor === session.id && (
                  <div ref={menuRef} className="absolute z-10 right-0 top-full mt-1 w-36 bg-gray-900 border border-gray-700 rounded-md shadow-lg py-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRenameStart(session); }}
                      className={`w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 ${language === 'am' ? 'font-amharic' : ''}`}
                    >
                      {t('sidebar.rename')}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteChat(session.id); }}
                      className={`w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 ${language === 'am' ? 'font-amharic' : ''}`}
                    >
                      {t('sidebar.delete')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 mt-auto">
        {/* Mini Language Switcher */}
        <div className="flex justify-center gap-2 mb-3">
          {availableLanguages.map((lang) => (
             <button
               key={lang.code}
               onClick={() => changeLanguage(lang.code)}
               className={`text-lg hover:scale-110 transition-transform ${language === lang.code ? 'opacity-100 grayscale-0' : 'opacity-50 grayscale'}`}
               title={lang.label}
             >
               {lang.flag}
             </button>
          ))}
        </div>

        <button 
          onClick={() => handleViewChange('settings')} 
          className={`w-full flex items-center gap-3 px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 text-left ${activeView === 'settings' ? 'bg-gray-800' : ''}`}
        >
          <SettingsIcon className="h-5 w-5" />
          <span className={`font-medium ${language === 'am' ? 'font-amharic' : ''}`}>{t('sidebar.settings')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
