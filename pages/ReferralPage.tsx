
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
    GiftIcon, UserPlusIcon, RocketIcon, CrownIcon, CopyIcon, 
    CheckCircleIcon, ShareIcon, ClockIcon, CheckIcon
} from '../components/Icons';
import { Referral } from '../types';

const mockReferrals: Referral[] = [
    { id: '1', name: 'Elias M.', date: 'Oct 3, 2023', plan: 'Pro', reward: 1000, status: 'paid' },
    { id: '2', name: 'Hana L.', date: 'Oct 5, 2023', plan: 'Free', reward: 100, status: 'pending' },
    { id: '3', name: 'Kaleb T.', date: 'Oct 12, 2023', plan: 'Max', reward: 10000, status: 'qualified' },
    { id: '4', name: 'Sara B.', date: 'Oct 15, 2023', plan: 'Free', reward: 100, status: 'pending' },
];

const ReferralPage: React.FC = () => {
    const { t, language } = useLanguage();
    const fontClass = language === 'am' ? 'font-amharic' : '';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('https://zemen.ai/r/username');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-6 overflow-y-auto">
            <header className="mb-8 flex items-center gap-3">
                <GiftIcon className="w-8 h-8 text-purple-500" />
                <h1 className={`text-3xl font-bold text-gray-100 ${fontClass}`}>{t('referrals.title')}</h1>
            </header>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl">
                    <p className={`text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`}>{t('referrals.stats.earnings')}</p>
                    <p className="text-2xl font-bold text-white">12,500 <span className="text-sm text-yellow-500">ZSC</span></p>
                </div>
                <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl">
                    <p className={`text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`}>{t('referrals.stats.active')}</p>
                    <p className="text-2xl font-bold text-white">8</p>
                </div>
                <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl">
                    <p className={`text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`}>{t('referrals.stats.pending')}</p>
                    <p className="text-2xl font-bold text-white">300 <span className="text-sm text-yellow-500">ZSC</span></p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 p-5 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-20"><CrownIcon className="w-12 h-12" /></div>
                    <p className={`text-purple-300 text-xs font-bold uppercase tracking-wider mb-1 ${fontClass}`}>{t('referrals.stats.rank')}</p>
                    <p className="text-2xl font-bold text-white">Silver</p>
                </div>
            </div>

            {/* Link Sharing Box */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 mb-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 w-full">
                    <h3 className={`text-lg font-bold text-white mb-4 ${fontClass}`}>{t('referrals.linkBox.label')}</h3>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 font-mono text-sm truncate">
                            https://zemen.ai/r/username
                        </div>
                        <button 
                            onClick={handleCopy}
                            className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${fontClass}`}
                        >
                            {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                            {copied ? t('referrals.linkBox.copied') : t('referrals.linkBox.copy')}
                        </button>
                        <button className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                            <ShareIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <p className={`text-sm text-gray-500 mt-3 ${fontClass}`}>{t('referrals.linkBox.footer')}</p>
                </div>
            </div>

            {/* Reward Tiers */}
            <h2 className={`text-xl font-bold text-gray-200 mb-4 ${fontClass}`}>{t('referrals.rewards.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Tier 1 */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex items-center gap-4 hover:bg-gray-800 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <UserPlusIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className={`font-bold text-gray-200 ${fontClass}`}>{t('referrals.rewards.signup')}</p>
                        <p className="text-sm text-gray-400">100 ZSC <span className="text-xs opacity-70">/ friend</span></p>
                    </div>
                </div>
                {/* Tier 2 */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex items-center gap-4 hover:bg-gray-800 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                        <RocketIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className={`font-bold text-gray-200 ${fontClass}`}>{t('referrals.rewards.pro')}</p>
                        <p className="text-sm text-gray-400">1,000 ZSC <span className="text-xs opacity-70">/ friend</span></p>
                    </div>
                </div>
                {/* Tier 3 */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex items-center gap-4 hover:bg-gray-800 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-yellow-900/30 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                        <CrownIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className={`font-bold text-gray-200 ${fontClass}`}>{t('referrals.rewards.max')}</p>
                        <p className="text-sm text-gray-400">10,000 ZSC <span className="text-xs opacity-70">/ friend</span></p>
                    </div>
                </div>
            </div>

            {/* Activity Table */}
            <h2 className={`text-xl font-bold text-gray-200 mb-4 ${fontClass}`}>{t('referrals.table.title')}</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden mb-8">
                <table className="w-full text-left">
                    <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase font-semibold">
                        <tr>
                            <th className={`px-6 py-4 ${fontClass}`}>{t('referrals.table.cols.friend')}</th>
                            <th className={`px-6 py-4 ${fontClass}`}>{t('referrals.table.cols.date')}</th>
                            <th className={`px-6 py-4 ${fontClass}`}>{t('referrals.table.cols.plan')}</th>
                            <th className={`px-6 py-4 ${fontClass}`}>{t('referrals.table.cols.reward')}</th>
                            <th className={`px-6 py-4 ${fontClass}`}>{t('referrals.table.cols.status')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50 text-sm">
                        {mockReferrals.map((ref) => (
                            <tr key={ref.id} className="hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-200">{ref.name}</td>
                                <td className="px-6 py-4 text-gray-500">{ref.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        ref.plan === 'Max' ? 'bg-yellow-500/20 text-yellow-400' : 
                                        ref.plan === 'Pro' ? 'bg-blue-500/20 text-blue-400' : 
                                        'bg-gray-700 text-gray-400'
                                    }`}>
                                        {ref.plan}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-green-400">+{ref.reward} ZSC</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        {ref.status === 'paid' && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
                                        {ref.status === 'qualified' && <CheckCircleIcon className="w-4 h-4 text-blue-500" />}
                                        {ref.status === 'pending' && <ClockIcon className="w-4 h-4 text-yellow-500" />}
                                        <span className={`capitalize ${
                                            ref.status === 'paid' ? 'text-green-500' : 
                                            ref.status === 'qualified' ? 'text-blue-500' : 'text-yellow-500'
                                        }`}>
                                            {ref.status}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 border border-blue-500/30 rounded-2xl p-8 text-center">
                <h3 className={`text-xl md:text-2xl font-bold text-white mb-4 max-w-2xl mx-auto leading-relaxed ${fontClass}`}>
                    {t('referrals.cta.text')}
                </h3>
                <button 
                    onClick={handleCopy}
                    className={`px-8 py-3 bg-white text-blue-900 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg ${fontClass}`}
                >
                    {t('referrals.cta.button')}
                </button>
            </div>
        </div>
    );
};

export default ReferralPage;
