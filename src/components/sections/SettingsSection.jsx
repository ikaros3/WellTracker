import React from 'react';
import { Settings, LogOut, Cloud, Download, Upload, Trash2, ChevronRight, RefreshCw, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSyncManager } from '../../hooks/useSyncManager';

const SettingsSection = ({ onExport, onImport, onReset, onSync }) => {
    const { user, logout } = useAuth();
    const { syncStatus, lastSyncedAt } = useSyncManager();

    const menuItems = [
        {
            title: '동기화',
            items: [
                {
                    icon: <RefreshCw size={20} className={syncStatus === 'syncing' ? "animate-spin text-blue-500" : "text-blue-500"} />,
                    text: '지금 동기화',
                    subText: lastSyncedAt ? `마지막: ${new Date(lastSyncedAt).toLocaleString()}` : null,
                    onClick: async () => {
                        if (onSync) await onSync();
                    },
                    textColor: 'text-gray-700'
                },
                {
                    icon: <LogOut size={20} className="text-gray-500" />,
                    text: '로그아웃',
                    onClick: logout,
                    textColor: 'text-gray-700'
                }
            ]
        },
        {
            title: '데이터 관리',
            items: [
                {
                    icon: <Download size={20} className="text-gray-500" />,
                    text: '데이터 내보내기',
                    subText: 'JSON 파일로 저장',
                    onClick: onExport,
                    textColor: 'text-gray-700'
                },
                {
                    icon: <Upload size={20} className="text-gray-500" />,
                    text: '데이터 불러오기',
                    subText: 'JSON 파일 복원',
                    onClick: () => document.getElementById('setting-file-input').click(),
                    textColor: 'text-gray-700'
                },
                {
                    icon: <Trash2 size={20} className="text-red-500" />,
                    text: '데이터 전체 초기화',
                    onClick: onReset,
                    textColor: 'text-red-600'
                }
            ]
        }
    ];

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* 프로필 헤더 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="min-w-16 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                    {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                    <h2 className="text-xl font-bold text-gray-900 truncate">
                        {user?.displayName || '사용자'}
                    </h2>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    <div className="flex items-center gap-1 mt-1 text-green-600 text-xs font-medium">
                        <Cloud size={12} />
                        <span>Google 계정 연동됨</span>
                    </div>
                </div>
            </div>

            {/* 설정 메뉴 */}
            <div className="space-y-6">
                {menuItems.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2 px-1 ml-1">{section.title}</h3>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                            {section.items.map((item, itemIdx) => (
                                <button
                                    key={itemIdx}
                                    onClick={item.onClick}
                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <span className={`block font-medium ${item.textColor} text-sm sm:text-base`}>
                                                {item.text}
                                            </span>
                                            {item.subText && (
                                                <span className="text-xs text-gray-400 mt-0.5 block">
                                                    {item.subText}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-400" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <input
                id="setting-file-input"
                type="file"
                onChange={onImport}
                accept=".json"
                className="hidden"
            />

            <p className="text-center text-xs text-gray-400 mt-8">
                WellTracker v1.0.0
            </p>
        </div>
    );
};

export default SettingsSection;
