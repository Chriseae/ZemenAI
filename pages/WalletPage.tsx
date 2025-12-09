
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
    WalletIcon, ArrowUpRightIcon, ArrowDownLeftIcon, CreditCardIcon, 
    GiftIcon, SparklesIcon, CpuIcon, CheckCircleIcon, ClockIcon, XCircleIcon, 
    QRCodeIcon, CopyIcon, SendIcon
} from '../components/Icons';
import { Transaction } from '../types';

const mockTransactions: Transaction[] = [
    { id: '1', type: 'sent', title: 'Sent to Elias', date: 'Today • 12:44 PM', amount: -250, status: 'completed' },
    { id: '2', type: 'reward', title: 'Referral Reward', date: 'Yesterday • 4:20 PM', amount: 150, status: 'completed' },
    { id: '3', type: 'training', title: 'AI Training Bonus', date: 'Oct 24 • 10:00 AM', amount: 50, status: 'completed' },
    { id: '4', type: 'subscription', title: 'Pro Subscription', date: 'Oct 20 • 9:00 AM', amount: -1000, status: 'completed' },
    { id: '5', type: 'received', title: 'Received from Hana', date: 'Oct 18 • 2:15 PM', amount: 500, status: 'pending' },
];

const WalletPage: React.FC = () => {
    const { t, language } = useLanguage();
    const fontClass = language === 'am' ? 'font-amharic' : '';
    const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing' | 'rewards'>('all');
    const [showSendModal, setShowSendModal] = useState(false);
    const [showReceiveModal, setShowReceiveModal] = useState(false);

    const filteredTransactions = mockTransactions.filter(tx => {
        if (filter === 'all') return true;
        if (filter === 'incoming') return tx.amount > 0 && tx.type !== 'reward' && tx.type !== 'training';
        if (filter === 'outgoing') return tx.amount < 0;
        if (filter === 'rewards') return tx.type === 'reward' || tx.type === 'training';
        return true;
    });

    const getTransactionIcon = (type: Transaction['type']) => {
        switch (type) {
            case 'sent': return <ArrowUpRightIcon className="w-5 h-5 text-red-400" />;
            case 'received': return <ArrowDownLeftIcon className="w-5 h-5 text-green-400" />;
            case 'reward': return <GiftIcon className="w-5 h-5 text-yellow-400" />;
            case 'subscription': return <SparklesIcon className="w-5 h-5 text-blue-400" />;
            case 'training': return <CpuIcon className="w-5 h-5 text-purple-400" />;
            default: return <WalletIcon className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-6 overflow-y-auto">
            <header className="mb-8 flex items-center gap-3">
                <WalletIcon className="w-8 h-8 text-yellow-500" />
                <h1 className={`text-3xl font-bold text-gray-100 ${fontClass}`}>{t('wallet.title')}</h1>
            </header>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <p className={`text-gray-400 text-sm font-medium uppercase tracking-wider mb-2 ${fontClass}`}>{t('wallet.balance.available')}</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-white tracking-tight">8,420</span>
                            <span className="text-2xl text-yellow-500 font-bold">ZSC</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-2">{t('wallet.balance.equivalent')}</p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => setShowSendModal(true)}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-yellow-900/20 ${fontClass}`}
                        >
                            <ArrowUpRightIcon className="w-5 h-5" />
                            {t('wallet.actions.send')}
                        </button>
                        <button 
                            onClick={() => setShowReceiveModal(true)}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all ${fontClass}`}
                        >
                            <QRCodeIcon className="w-5 h-5" />
                            {t('wallet.actions.receive')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className={`text-xl font-bold text-gray-200 ${fontClass}`}>{t('wallet.transactions.title')}</h2>
                    <div className="flex p-1 bg-gray-800 rounded-lg overflow-x-auto max-w-full">
                        {['all', 'incoming', 'outgoing', 'rewards'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap capitalize ${
                                    filter === f ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
                                } ${fontClass}`}
                            >
                                {t(`wallet.transactions.filters.${f}` as any)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
                    {filteredTransactions.length > 0 ? (
                        <div className="divide-y divide-gray-700/50">
                            {filteredTransactions.map(tx => (
                                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-800 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center group-hover:border-gray-600 transition-colors">
                                            {getTransactionIcon(tx.type)}
                                        </div>
                                        <div>
                                            <p className={`font-semibold text-gray-200 ${fontClass}`}>{tx.title}</p>
                                            <p className="text-xs text-gray-500">{tx.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-gray-200'}`}>
                                            {tx.amount > 0 ? '+' : ''}{tx.amount} ZSC
                                        </p>
                                        <div className="flex items-center justify-end gap-1 mt-0.5">
                                            {tx.status === 'completed' && <CheckCircleIcon className="w-3 h-3 text-green-500" />}
                                            {tx.status === 'pending' && <ClockIcon className="w-3 h-3 text-yellow-500" />}
                                            {tx.status === 'failed' && <XCircleIcon className="w-3 h-3 text-red-500" />}
                                            <span className={`text-xs capitalize ${
                                                tx.status === 'completed' ? 'text-green-500' : 
                                                tx.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                                            } ${fontClass}`}>
                                                {t(`wallet.transactions.status.${tx.status}` as any)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            <WalletIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className={fontClass}>{t('wallet.transactions.empty')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Send Modal */}
            {showSendModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                        <button onClick={() => setShowSendModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                            <XCircleIcon className="w-6 h-6" />
                        </button>
                        <h3 className={`text-xl font-bold text-white mb-6 ${fontClass}`}>{t('wallet.sendModal.title')}</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium text-gray-400 mb-1 ${fontClass}`}>{t('wallet.sendModal.recipient')}</label>
                                <div className="relative">
                                    <input type="text" placeholder="0x..." className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-10 py-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none" />
                                    <QRCodeIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer hover:text-white" />
                                </div>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium text-gray-400 mb-1 ${fontClass}`}>{t('wallet.sendModal.amount')}</label>
                                <input type="number" placeholder="0.00" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none" />
                                <p className="text-xs text-gray-500 mt-1 text-right">≈ $0.00 USD</p>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium text-gray-400 mb-1 ${fontClass}`}>{t('wallet.sendModal.note')}</label>
                                <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none" />
                            </div>
                            <button className={`w-full py-3.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-bold mt-2 ${fontClass}`}>
                                {t('wallet.sendModal.submit')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Receive Modal */}
            {showReceiveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-center">
                        <button onClick={() => setShowReceiveModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                            <XCircleIcon className="w-6 h-6" />
                        </button>
                        <h3 className={`text-xl font-bold text-white mb-6 ${fontClass}`}>{t('wallet.receiveModal.title')}</h3>
                        
                        <div className="bg-white p-4 rounded-xl inline-block mb-6">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0xZemenAIWalletAddress123`} alt="QR Code" className="w-40 h-40" />
                        </div>

                        <div className="bg-gray-800 rounded-lg p-3 mb-6 flex items-center justify-between gap-2">
                            <code className="text-sm text-gray-300 truncate">0xZemenAIWalletAddress...8f2</code>
                            <button className="text-gray-400 hover:text-white" title={t('wallet.receiveModal.copy')}>
                                <CopyIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <p className={`text-sm text-gray-500 mb-6 ${fontClass}`}>
                            {t('wallet.receiveModal.note')}
                        </p>

                        <button className={`w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium border border-gray-700 ${fontClass}`}>
                            {t('wallet.receiveModal.share')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletPage;
