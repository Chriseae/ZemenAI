
import React from 'react';
import { SettingsIcon, UserIcon, MoonIcon, SunIcon, BellIcon, ShieldIcon, CpuIcon, TrashIcon } from '../components/Icons';
import { useLanguage } from '../contexts/LanguageContext';

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">{title}</h3>
        <div className="bg-gray-800 rounded-xl border border-gray-700 divide-y divide-gray-700 overflow-hidden">
            {children}
        </div>
    </div>
);

const SettingItem: React.FC<{ icon: React.ReactNode; label: string; action: React.ReactNode }> = ({ icon, label, action }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-750 transition-colors">
        <div className="flex items-center gap-3 text-gray-200">
            <div className="text-gray-400">{icon}</div>
            <span className="font-medium">{label}</span>
        </div>
        <div>{action}</div>
    </div>
);

const Toggle: React.FC<{ checked?: boolean }> = ({ checked = false }) => (
    <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-600'}`}>
        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-5' : ''}`}></div>
    </div>
);

const SettingsPage: React.FC = () => {
  const { t, language, changeLanguage, availableLanguages } = useLanguage();
  const fontClass = language === 'am' ? 'font-amharic' : '';

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto p-6 overflow-y-auto">
      <header className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-gray-400" />
        <h1 className={`text-3xl font-bold text-gray-100 ${fontClass}`}>{t('settings.title')}</h1>
      </header>

      <SettingsSection title={t('settings.sections.general')}>
         <SettingItem 
            icon={<UserIcon className="w-5 h-5" />} 
            label={t('settings.labels.account')} 
            action={<span className="text-sm text-gray-400">user@example.com</span>} 
         />
         <SettingItem 
            icon={<MoonIcon className="w-5 h-5" />} 
            label={t('settings.labels.theme')} 
            action={
                <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-1">
                    <button className="p-1.5 bg-gray-700 rounded text-white"><MoonIcon className="w-4 h-4"/></button>
                    <button className="p-1.5 text-gray-500 hover:text-white"><SunIcon className="w-4 h-4"/></button>
                </div>
            } 
         />
         <SettingItem 
            icon={<span className="font-bold text-sm border border-gray-500 rounded px-1">EN</span>} 
            label={t('settings.labels.language')} 
            action={
                <select 
                    value={language}
                    onChange={(e) => changeLanguage(e.target.value as any)}
                    className="bg-gray-900 text-gray-200 text-sm rounded-md border-gray-700 border px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
                >
                    {availableLanguages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.label} {lang.flag}</option>
                    ))}
                </select>
            } 
         />
      </SettingsSection>

      <SettingsSection title={t('settings.sections.model')}>
        <SettingItem 
            icon={<CpuIcon className="w-5 h-5" />} 
            label={t('settings.labels.aiModel')} 
            action={
                <select className="bg-gray-900 text-gray-200 text-sm rounded-md border-gray-700 border px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500">
                    <option>Gemini 3 Pro (Preview)</option>
                    <option>Zemen-LLM (Fine-tuned)</option>
                    <option>Gemini 2.5 Flash</option>
                </select>
            } 
         />
         <SettingItem 
            icon={<ShieldIcon className="w-5 h-5" />} 
            label={t('settings.labels.memory')} 
            action={<Toggle checked />} 
         />
      </SettingsSection>

      <SettingsSection title={t('settings.sections.data')}>
        <SettingItem 
            icon={<BellIcon className="w-5 h-5" />} 
            label={t('settings.labels.notifications')} 
            action={<Toggle checked={false} />} 
         />
         <SettingItem 
            icon={<TrashIcon className="w-5 h-5" />} 
            label={t('settings.labels.clearData')} 
            action={
                <button className={`px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors ${fontClass}`}>
                    {t('settings.labels.clearDataButton')}
                </button>
            } 
         />
      </SettingsSection>
    </div>
  );
};

export default SettingsPage;
