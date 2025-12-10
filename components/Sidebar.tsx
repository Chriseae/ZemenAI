import React from 'react';
import {
  ChatIcon,
  LibraryIcon,
  ProjectsIcon,
  SettingsIcon,
  CloseIcon,
  WalletIcon,
  ReferralIcon,
  UserIcon
} from './Icons';
import { View } from '../App';

interface SidebarProps {
  closeSidebar: () => void;
  activeView: View;
  setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar, activeView, setActiveView }) => {
  const menuItems = [
    { view: 'chat' as View, label: 'Chat', icon: ChatIcon },
    { view: 'library' as View, label: 'Knowledge Library', icon: LibraryIcon },
    { view: 'projects' as View, label: 'Projects', icon: ProjectsIcon },
    { view: 'wallet' as View, label: 'Wallet', icon: WalletIcon },
    { view: 'referrals' as View, label: 'Referrals', icon: ReferralIcon },
  ];

  const bottomItems = [
    { view: 'profile' as View, label: 'Profile', icon: UserIcon },
    { view: 'settings' as View, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-950 border-r border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">ZemenAI</h2>
        <button
          onClick={closeSidebar}
          className="md:hidden p-2 rounded-md text-gray-400 hover:bg-gray-800"
          aria-label="Close sidebar"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Main Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;

          return (
            // In Sidebar.tsx, add this menu item:
            <button
              onClick={() => {
                setActiveView('profile');
                closeSidebar();
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Menu Items */}
      <div className="p-4 space-y-2 border-t border-gray-800">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;

          return (
            <button
              key={item.view}
              onClick={() => {
                setActiveView(item.view);
                closeSidebar();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;