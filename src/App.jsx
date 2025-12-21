import React, { useState, useEffect } from "react";
import { Activity, User, Heart, Droplets, Sparkles, Check, AlertCircle } from "lucide-react";

// Components
import { Modal, Button } from "./components/common";
import { ProfileSection, BPSection, GlucoseSection, AIInsightSection } from "./components/sections";

// Utils
import { downloadCSV } from "./utils/fileHelpers";

// --- Main App ---
export default function App() {
  const [activeTab, setActiveTab] = useState("bp");
  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  // 1. Lazy Initialization (Load from LocalStorage on startup)
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("health_profile");
      return saved
        ? JSON.parse(saved)
        : {
          name: "",
          birthdate: "",
          height: "",
          weight: "",
          gender: "male",
          meds: { bp: false, diabetes: false, lipid: false, aspirin: false },
        };
    } catch (e) {
      return {
        name: "",
        birthdate: "",
        height: "",
        weight: "",
        gender: "male",
        meds: { bp: false, diabetes: false, lipid: false, aspirin: false },
      };
    }
  });

  const [bpRecords, setBpRecords] = useState(() => {
    try {
      const saved = localStorage.getItem("health_bp");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [glucoseRecords, setGlucoseRecords] = useState(() => {
    try {
      const saved = localStorage.getItem("health_glucose");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 2. Auto-save (Sync state to LocalStorage)
  useEffect(() => {
    localStorage.setItem("health_profile", JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem("health_bp", JSON.stringify(bpRecords));
  }, [bpRecords]);
  useEffect(() => {
    localStorage.setItem("health_glucose", JSON.stringify(glucoseRecords));
  }, [glucoseRecords]);

  // Handlers
  const handleProfileChange = (field, value) =>
    setProfile((prev) => ({ ...prev, [field]: value }));
  const handleMedToggle = (med) =>
    setProfile((prev) => ({
      ...prev,
      meds: { ...prev.meds, [med]: !prev.meds[med] },
    }));

  // Manual Save (LocalStorage Feedback)
  const saveToLocal = () => {
    setNotification({
      isOpen: true,
      title: "저장 완료",
      message: "브라우저 저장소에 데이터가 안전하게 저장되었습니다.",
    });
  };

  // Manual Load (LocalStorage Feedback)
  const loadFromLocal = () => {
    try {
      const p = localStorage.getItem("health_profile");
      const b = localStorage.getItem("health_bp");
      const g = localStorage.getItem("health_glucose");
      if (p) setProfile(JSON.parse(p));
      if (b) setBpRecords(JSON.parse(b));
      if (g) setGlucoseRecords(JSON.parse(g));
      setNotification({
        isOpen: true,
        title: "복원 완료",
        message: "저장된 데이터를 불러왔습니다.",
      });
    } catch (e) {
      setNotification({
        isOpen: true,
        title: "오류",
        message: "데이터를 불러오는 중 오류가 발생했습니다.",
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

  // File Export (Fixed name: 혈압_혈당.json)
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

  const renderTabs = () => (
    <div className="sticky top-0 z-50 bg-gray-50 pt-2 pb-4">
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl overflow-x-auto shadow-sm">
        {[
          { id: "profile", icon: User, label: "기본 정보" },
          { id: "bp", icon: Heart, label: "혈압" },
          { id: "glucose", icon: Droplets, label: "혈당" },
          { id: "ai", icon: Sparkles, label: "AI 코치" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
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
        <header className="mb-4 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-3">
            <Activity className="text-blue-600" size={32} />
            혈압-혈당 관리
          </h1>
          <p className="text-gray-500 mt-2">
            매일의 혈압과 혈당을 기록하여 건강한 삶을 유지하세요.
          </p>
        </header>
        {renderTabs()}
        <main>
          {activeTab === "profile" && (
            <ProfileSection
              profile={profile}
              onChange={handleProfileChange}
              onMedToggle={handleMedToggle}
              onSave={saveToLocal}
              onExport={handleExport}
              onImport={handleImport}
              onLoad={loadFromLocal}
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
