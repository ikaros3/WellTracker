import React, { useState } from "react";
import { Activity, User, Heart, Droplets, Sparkles, Check, AlertCircle, LogOut, RefreshCw, Cloud, CloudOff, Settings } from "lucide-react";

// Auth
import { useAuth } from "./contexts/AuthContext";
import { LoginScreen } from "./components/auth";

// Sync
import { useSyncManager } from "./hooks/useSyncManager";

// Components
import { Modal, Button } from "./components/common";
import { ProfileSection, BPSection, GlucoseSection, AIInsightSection } from "./components/sections";
import SettingsSection from "./components/sections/SettingsSection";

// Utils
import { downloadCSV } from "./utils/fileHelpers";

// --- Main App ---
export default function App() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth(); // logout is used in SettingsSection via useAuth, but if we want to pass it manually... useAuth inside SettingsSection is better.

  // 동기화 매니저
  const {
    profile,
    bpRecords,
    glucoseRecords,
    setProfile,
    setBpRecords,
    setGlucoseRecords,
    syncStatus,
    lastSyncedAt,
    isInitialized,
    manualSync,
    resetAllData,
    syncBeforeLogout
  } = useSyncManager();

  const [activeTab, setActiveTab] = useState("bp");
  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  // 로딩 중
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 로그인되지 않은 경우
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // 데이터 초기화 중
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">데이터 동기화 중...</p>
        </div>
      </div>
    );
  }

  // Handlers
  const handleProfileChange = (field, value) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const handleMedToggle = (med) =>
    setProfile((prev) => ({
      ...prev,
      meds: { ...prev.meds, [med]: !prev.meds[med] },
    }));

  const handleManualSync = async () => {
    const success = await manualSync();
    setNotification({
      isOpen: true,
      title: success ? "동기화 완료" : "동기화 실패",
      message: success
        ? "클라우드에 데이터가 저장되었습니다."
        : "동기화 중 오류가 발생했습니다. 다시 시도해주세요.",
    });
  };

  const handleResetData = async () => {
    if (window.confirm('정말로 모든 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      const success = await resetAllData();
      setNotification({
        isOpen: true,
        title: success ? "초기화 완료" : "초기화 실패",
        message: success
          ? "모든 데이터가 삭제되었습니다."
          : "데이터 초기화 중 오류가 발생했습니다.",
      });
    }
  };

  const addBpRecord = (record) =>
    setBpRecords((prev) =>
      [...prev, { ...record, id: Date.now() }].sort(
        (a, b) =>
          new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time)
      )
    );

  const updateBpRecord = (record) =>
    setBpRecords((prev) =>
      prev
        .map((r) => (r.id === record.id ? record : r))
        .sort(
          (a, b) =>
            new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time)
        )
    );

  const deleteBpRecord = (id) =>
    setBpRecords((prev) => prev.filter((r) => r.id !== id));

  const addGlucoseRecord = (record) =>
    setGlucoseRecords((prev) =>
      [...prev, { ...record, id: Date.now() }].sort(
        (a, b) =>
          new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time)
      )
    );

  const updateGlucoseRecord = (record) =>
    setGlucoseRecords((prev) =>
      prev
        .map((r) => (r.id === record.id ? record : r))
        .sort(
          (a, b) =>
            new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time)
        )
    );

  const deleteGlucoseRecord = (id) =>
    setGlucoseRecords((prev) => prev.filter((r) => r.id !== id));

  const handleExport = () => {
    const data = {
      profile,
      bpRecords,
      glucoseRecords,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "혈압_혈당.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setNotification({
      isOpen: true,
      title: "다운로드 완료",
      message: "'혈압_혈당.json' 파일이 저장되었습니다.",
    });
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.profile) setProfile(data.profile);
        if (data.bpRecords) setBpRecords(data.bpRecords);
        if (data.glucoseRecords) setGlucoseRecords(data.glucoseRecords);
        setNotification({
          isOpen: true,
          title: "복원 완료",
          message: "파일에서 데이터를 성공적으로 불러왔습니다.",
        });
      } catch (err) {
        setNotification({
          isOpen: true,
          title: "복원 실패",
          message: "파일 형식이 올바르지 않습니다.",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const SyncStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw size={16} className="animate-spin text-blue-500" />;
      case 'synced':
        return <Cloud size={16} className="text-green-500" />;
      case 'error':
        return <CloudOff size={16} className="text-red-500" />;
      default:
        return <Cloud size={16} className="text-gray-400" />;
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'syncing': return "동기화 중...";
      case 'synced': return "동기화됨";
      case 'error': return "동기화 오류";
      default: return "대기 중";
    }
  };

  const renderTabs = () => (
    <div className="sticky top-0 z-50 bg-gray-50 pt-2 pb-4">
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl overflow-x-auto shadow-sm no-scrollbar">
        {[
          { id: "profile", icon: User, label: "기본 정보" },
          { id: "bp", icon: Heart, label: "혈압" },
          { id: "glucose", icon: Droplets, label: "혈당" },
          { id: "ai", icon: Sparkles, label: "AI 코치" },
          { id: "settings", icon: Settings, label: "설정" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all whitespace-nowrap min-w-[100px] ${activeTab === tab.id
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-500 hover:bg-white hover:text-blue-600"
              }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto relative">
        {/* 헤더 */}
        <header className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="text-blue-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">혈압-혈당 관리</h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  매일의 혈압과 혈당을 기록하여 건강한 삶을 유지하세요.
                </p>
              </div>
            </div>

            {/* 동기화 상태 (클릭 시 설정 탭으로 이동) */}
            <button
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <SyncStatusIcon />
              <span className={`text-xs font-medium ${syncStatus === 'error' ? 'text-red-500' : 'text-gray-600'}`}>
                {getSyncStatusText()}
              </span>
            </button>
          </div>
        </header>

        {renderTabs()}

        <main>
          {activeTab === "profile" && (
            <ProfileSection
              profile={profile}
              onChange={handleProfileChange}
              onMedToggle={handleMedToggle}
              onSave={handleManualSync}
            />
          )}
          {activeTab === "bp" && (
            <BPSection
              records={bpRecords}
              onAdd={addBpRecord}
              onUpdate={updateBpRecord}
              onDelete={deleteBpRecord}
              onDownload={() => downloadCSV(bpRecords, "bp")}
            />
          )}
          {activeTab === "glucose" && (
            <GlucoseSection
              records={glucoseRecords}
              onAdd={addGlucoseRecord}
              onUpdate={updateGlucoseRecord}
              onDelete={deleteGlucoseRecord}
              onDownload={() => downloadCSV(glucoseRecords, "glucose")}
            />
          )}
          {activeTab === "ai" && (
            <AIInsightSection
              profile={profile}
              bpRecords={bpRecords}
              glucoseRecords={glucoseRecords}
            />
          )}
          {activeTab === "settings" && (
            <SettingsSection
              onExport={handleExport}
              onImport={handleImport}
              onReset={handleResetData}
              onSync={handleManualSync}
            />
          )}
        </main>

        <Modal
          isOpen={notification.isOpen}
          onClose={() => setNotification({ ...notification, isOpen: false })}
          title={notification.title}
        >
          <div className="text-center space-y-4">
            {notification.title.includes("실패") ||
              notification.title.includes("오류") ? (
              <div className="flex justify-center text-red-500">
                <AlertCircle size={48} />
              </div>
            ) : (
              <div className="flex justify-center text-green-500">
                <Check size={48} />
              </div>
            )}
            <p className="text-gray-700 whitespace-pre-line">
              {notification.message}
            </p>
            <Button
              onClick={() =>
                setNotification({ ...notification, isOpen: false })
              }
              className="w-full"
            >
              확인
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
