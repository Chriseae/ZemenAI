
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { GoogleIcon, AppleIcon, FacebookIcon, EmailIcon, ZemenaiIcon } from '../components/Icons';

interface SignInSignUpScreenProps {
  onComplete: () => void;
}

const SignInSignUpScreen: React.FC<SignInSignUpScreenProps> = ({ onComplete }) => {
  const { t, language } = useLanguage();
  const fontClass = language === 'am' ? 'font-amharic' : '';

  const SocialButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-xl text-white font-medium transition-colors mb-3 ${fontClass}`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="max-w-md w-full">
        <div className="mb-8">
            <ZemenaiIcon className="text-4xl mb-6" />
            <h1 className={`text-2xl font-bold text-white mb-2 ${fontClass}`}>
            {t('onboarding.auth.title')}
            </h1>
            <p className={`text-gray-400 ${fontClass}`}>
            {t('onboarding.auth.subtitle')}
            </p>
        </div>

        <div className="space-y-4">
          <SocialButton 
            icon={<GoogleIcon />} 
            label={t('onboarding.auth.google')} 
            onClick={onComplete} // Simulate Auth
          />
          <SocialButton 
            icon={<AppleIcon />} 
            label={t('onboarding.auth.apple')} 
            onClick={onComplete} // Simulate Auth
          />
          <SocialButton 
            icon={<FacebookIcon />} 
            label={t('onboarding.auth.facebook')} 
            onClick={onComplete} // Simulate Auth
          />
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-950 px-2 text-gray-500">Or</span>
            </div>
          </div>

          <button
            onClick={onComplete} // Simulate Email Flow
            className={`w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors ${fontClass}`}
          >
            <EmailIcon className="w-5 h-5" />
            <span>{t('onboarding.auth.email')}</span>
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <span className={fontClass}>{t('onboarding.auth.footer')} </span>
          <button onClick={onComplete} className={`text-blue-400 hover:text-blue-300 font-medium ${fontClass}`}>
            {t('onboarding.auth.footerLink')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUpScreen;
