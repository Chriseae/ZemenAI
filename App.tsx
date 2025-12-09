
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatPage from './pages/ChatPage';
import KnowledgeLibraryPage from './pages/KnowledgeLibraryPage';
import ProjectsPage from './pages/ProjectsPage';
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';
import CheckoutPage from './pages/CheckoutPage';
import InterestSelectionScreen from './pages/InterestSelectionScreen';
import OnboardingIntroScreen from './pages/OnboardingIntroScreen';
import SignInSignUpScreen from './pages/SignInSignUpScreen';
import WalletPage from './pages/WalletPage';
import ReferralPage from './pages/ReferralPage';
import { MenuIcon } from './components/Icons';
import { ChatProvider } from './hooks/useZemenaiChat';
import { LanguageProvider } from './contexts/LanguageContext';

export type View = 'landing' | 'interests' | 'intro' | 'auth' | 'chat' | 'library' | 'projects' | 'settings' | 'checkout' | 'wallet' | 'referrals';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('landing');
  const [checkoutParams, setCheckoutParams] = useState<{ plan: 'pro' | 'max'; billing: 'monthly' | 'yearly' } | null>(null);

  const handleNavigate = (view: View, params?: any) => {
    if (view === 'checkout' && params) {
        setCheckoutParams(params);
    }
    setActiveView(view);
  };

  const isOnboardingFlow = ['landing', 'interests', 'intro', 'auth', 'checkout'].includes(activeView);

  const renderContent = () => {
    switch (activeView) {
      case 'library':
        return <KnowledgeLibraryPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'wallet':
        return <WalletPage />;
      case 'referrals':
        return <ReferralPage />;
      case 'chat':
        return <ChatPage />;
      case 'interests':
        return <InterestSelectionScreen onComplete={() => setActiveView('intro')} />;
      case 'intro':
        return <OnboardingIntroScreen onConfirm={() => setActiveView('auth')} />;
      case 'auth':
        return <SignInSignUpScreen onComplete={() => setActiveView('chat')} />;
      case 'checkout':
        return checkoutParams ? (
            <CheckoutPage 
                plan={checkoutParams.plan} 
                billing={checkoutParams.billing} 
                onBack={() => setActiveView('landing')} 
            />
        ) : <LandingPage onStart={() => setActiveView('interests')} onNavigate={handleNavigate} />;
      case 'landing':
      default:
        // Updated flow: Landing -> Interests
        return <LandingPage onStart={() => setActiveView('interests')} onNavigate={handleNavigate} />;
    }
  };

  return (
    <LanguageProvider>
      <ChatProvider>
        <div className="flex h-screen w-screen bg-gray-900 text-gray-100 overflow-hidden">
          {/* Sidebar - Only visible for main app views */}
          {!isOnboardingFlow && (
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-950 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-shrink-0`}>
              <Sidebar
                closeSidebar={() => setSidebarOpen(false)}
                activeView={activeView}
                setActiveView={setActiveView}
              />
            </div>
          )}

          <div className="flex-1 flex flex-col relative overflow-hidden">
            {/* Mobile Menu Button - Only for main app views */}
            {!isOnboardingFlow && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden absolute top-4 left-4 z-20 p-2 rounded-md text-gray-400 hover:bg-gray-800"
                aria-label="Open sidebar"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            )}
            {renderContent()}
          </div>
        </div>
      </ChatProvider>
    </LanguageProvider>
  );
};

export default App;
