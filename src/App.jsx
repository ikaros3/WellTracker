import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import {
  Activity,
  Heart,
  Droplets,
  User,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  Pill,
  X,
  Check,
  Download,
  Info,
  AlertCircle,
  Upload,
  FileJson,
  Save,
  MoveHorizontal,
  ChevronLeft,
  ChevronRight,
  Cloud,
  RefreshCw,
  Sparkles,
  BrainCircuit,
  MessageSquare,
} from "lucide-react";

// --- Gemini API Setup ---
const GEMINI_API_KEY = ""; // Provided by runtime environment

const callGeminiAPI = async (prompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "분석 결과를 가져올 수 없습니다."
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서비스 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

// --- UI Components ---
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const Button = ({
  onClick,
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}) => {
  const baseStyle =
    "px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    success: "bg-green-600 text-white hover:bg-green-700",
    ghost: "hover:bg-gray-100 text-gray-600",
    ai: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 shadow-md",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
    />
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

// --- Pagination Control Component ---
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-4 py-2 border-t border-gray-100">
      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2"
      >
        <ChevronLeft size={20} />
      </Button>
      <span className="text-sm font-medium text-gray-700">
        {currentPage} / {totalPages}
      </span>
      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2"
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );
};

// --- Reference Guide Component ---
const ReferenceGuide = ({ type }) => {
  if (type === "bp") {
    return (
      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Info size={16} className="text-blue-500" /> 혈압 판정 기준표
        </h3>
        <div className="grid grid-cols-5 text-center text-xs sm:text-sm border border-slate-200 rounded-lg overflow-hidden">
          {/* Header Row */}
          <div className="py-2 bg-gray-100 font-bold text-gray-700 border-b border-r border-gray-200">
            구분
          </div>
          <div className="py-2 bg-green-100 font-bold text-green-800 border-b border-r border-green-200">
            정상
          </div>
          <div className="py-2 bg-orange-100 font-bold text-orange-800 border-b border-r border-orange-200">
            전단계
          </div>
          <div className="py-2 bg-red-100 font-bold text-red-800 border-b border-r border-red-200">
            1기 고혈압
          </div>
          <div className="py-2 bg-purple-100 font-bold text-purple-800 border-b border-purple-200">
            2기 고혈압
          </div>

          {/* Systolic Row */}
          <div className="py-2 bg-gray-50 font-semibold text-gray-700 border-b border-r border-gray-200">
            수축기
          </div>
          <div className="py-2 bg-green-50 text-green-900 border-b border-r border-green-200">
            120 미만
          </div>
          <div className="py-2 bg-orange-50 text-orange-900 border-b border-r border-orange-200">
            120 ~ 139
          </div>
          <div className="py-2 bg-red-50 text-red-900 border-b border-r border-red-200">
            140 ~ 159
          </div>
          <div className="py-2 bg-purple-50 text-purple-900 border-b border-purple-200">
            160 이상
          </div>

          {/* Diastolic Row */}
          <div className="py-2 bg-gray-50 font-semibold text-gray-700 border-r border-gray-200">
            이완기
          </div>
          <div className="py-2 bg-green-50 text-green-900 border-r border-green-200">
            80 미만
          </div>
          <div className="py-2 bg-orange-50 text-orange-900 border-r border-orange-200">
            80 ~ 89
          </div>
          <div className="py-2 bg-red-50 text-red-900 border-r border-red-200">
            90 ~ 99
          </div>
          <div className="py-2 bg-purple-50 text-purple-900">100 이상</div>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-right">
          * 대한고혈압학회 진료지침 참고
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
        <Info size={16} className="text-teal-500" /> 혈당 판정 기준표
      </h3>
      <div className="grid grid-cols-4 text-center text-xs sm:text-sm border border-slate-200 rounded-lg overflow-hidden">
        {/* Header Row */}
        <div className="py-2 bg-gray-100 font-bold text-gray-700 border-b border-r border-gray-200">
          시간
        </div>
        <div className="py-2 bg-green-100 font-bold text-green-800 border-b border-r border-green-200">
          정상
        </div>
        <div className="py-2 bg-orange-100 font-bold text-orange-800 border-b border-r border-orange-200">
          전단계
        </div>
        <div className="py-2 bg-red-100 font-bold text-red-800 border-b border-red-200">
          관리필요
        </div>

        {/* Fasting Row */}
        <div className="py-2 bg-gray-50 font-semibold text-gray-700 border-b border-r border-gray-200">
          공복
        </div>
        <div className="py-2 bg-green-50 text-green-900 border-b border-r border-green-200">
          100 미만
        </div>
        <div className="py-2 bg-orange-50 text-orange-900 border-b border-r border-orange-200">
          100 ~ 125
        </div>
        <div className="py-2 bg-red-50 text-red-900 border-b border-red-200">
          126 이상
        </div>

        {/* Post-meal 1h Row */}
        <div className="py-2 bg-gray-50 font-semibold text-gray-700 border-b border-r border-gray-200">
          식후 1시간
        </div>
        <div className="py-2 bg-green-50 text-green-900 border-b border-r border-green-200">
          180 미만
        </div>
        <div className="py-2 bg-orange-50 text-orange-900 border-b border-r border-orange-200">
          180 ~ 199
        </div>
        <div className="py-2 bg-red-50 text-red-900 border-b border-red-200">
          200 이상
        </div>

        {/* Post-meal 2h Row */}
        <div className="py-2 bg-gray-50 font-semibold text-gray-700 border-r border-gray-200">
          식후 2시간
        </div>
        <div className="py-2 bg-green-50 text-green-900 border-r border-green-200">
          140 미만
        </div>
        <div className="py-2 bg-orange-50 text-orange-900 border-r border-orange-200">
          140 ~ 199
        </div>
        <div className="py-2 bg-red-50 text-red-900">200 이상</div>
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-right">
        * 대한당뇨병학회 진단 기준 참고
      </p>
    </div>
  );
};

// --- Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50 sticky top-0 bg-white/95 backdrop-blur z-10">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// --- BackupRestoreCard Component ---
const BackupRestoreCard = ({ onExport, onImport, onSave, onLoad }) => {
  const fileInputRef = useRef(null);

  return (
    <Card className="p-6 border-slate-200 mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Save className="text-blue-500" size={20} /> 데이터 관리
      </h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onSave}
          variant="outline"
          className="flex-1 border-blue-600 text-blue-700 hover:bg-blue-50"
        >
          <Save size={18} /> 저장 (백업)
        </Button>
        <Button
          onClick={onLoad}
          variant="outline"
          className="flex-1 border-slate-400 text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw size={18} /> 불러오기 (복원)
        </Button>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        '저장'을 누르면 데이터가 브라우저에 안전하게 저장됩니다.
        <br />
        '불러오기'를 누르면 저장된 데이터를 다시 가져옵니다.
      </p>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-bold text-gray-600 mb-2">
          파일로 내보내기 / 가져오기 (JSON)
        </h4>
        <div className="flex gap-3">
          <Button
            onClick={onExport}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 text-xs"
          >
            <Download size={14} /> 파일로 저장
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 text-xs"
          >
            <Upload size={14} /> 파일 불러오기
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImport}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>
    </Card>
  );
};

// --- Custom Ticks & Dots ---
const CustomYAxisTick = ({ x, y, payload, unit }) => (
  <g transform={`translate(30,${y})`}>
    <text x={0} y={0} dy={4} textAnchor="middle" fontSize={12} fill="#374151">
      {payload.value}
    </text>
  </g>
);

const CustomXAxisTick = ({ x, y, payload, index, data }) => {
  const [datePart, timePart] = payload.value.split(" ");
  const isNewDay =
    index === 0 || data[index - 1].name.split(" ")[0] !== datePart;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={25}
        textAnchor="middle"
        fontSize={12}
        fill="#374151"
      >
        <tspan x={0} dy={25}>
          {timePart}
        </tspan>
        {isNewDay && (
          <tspan x="0" dy={18} fontSize={11} fill="#6b7280" fontWeight="bold">
            {datePart}
          </tspan>
        )}
      </text>
    </g>
  );
};

const CustomBPDot = (props) => {
  const { cx, cy, payload, dataKey, stroke } = props;
  const value = payload[dataKey];
  let fillColor = "#fff";
  let strokeColor = stroke;
  let r = 4;
  let isWarningOrDanger = false;

  if (dataKey === "systolic") {
    if (value >= 120) isWarningOrDanger = true;
    if (value >= 140) {
      strokeColor = "#dc2626";
      fillColor = "#fee2e2";
    } else if (value >= 120) {
      strokeColor = "#d97706";
      fillColor = "#fef3c7";
    }
  } else if (dataKey === "diastolic") {
    if (value >= 80) isWarningOrDanger = true;
    if (value >= 90) {
      strokeColor = "#dc2626";
      fillColor = "#fee2e2";
    } else if (value >= 80) {
      strokeColor = "#d97706";
      fillColor = "#fef3c7";
    }
  }

  if (isWarningOrDanger) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={7}
          stroke={strokeColor}
          strokeWidth={2}
          fill={fillColor}
        />
        <circle cx={cx} cy={cy} r={3} fill={strokeColor} />
      </g>
    );
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      stroke={strokeColor}
      strokeWidth={2}
      fill={fillColor}
    />
  );
};

const CustomGlucoseDot = (props) => {
  const { cx, cy, payload, stroke } = props;
  const value = payload.level;
  const status = payload.mealStatus;
  let fillColor = "#fff";
  let strokeColor = stroke;
  let r = 4;
  let isWarningOrDanger = false;

  if (status === "fasting") {
    if (value >= 100) isWarningOrDanger = true;
    if (value >= 126 || value < 70) {
      strokeColor = "#dc2626";
      fillColor = "#fee2e2";
    } else if (value >= 100) {
      strokeColor = "#d97706";
      fillColor = "#fef3c7";
    }
  } else {
    if (value >= 140) isWarningOrDanger = true;
    if (value >= 200 || value < 70) {
      strokeColor = "#dc2626";
      fillColor = "#fee2e2";
    } else if (value >= 140) {
      strokeColor = "#d97706";
      fillColor = "#fef3c7";
    }
  }

  if (isWarningOrDanger) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={7}
          stroke={strokeColor}
          strokeWidth={2}
          fill={fillColor}
        />
        <circle cx={cx} cy={cy} r={3} fill={strokeColor} />
      </g>
    );
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      stroke={strokeColor}
      strokeWidth={2}
      fill={fillColor}
    />
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const systolic = payload.find((p) => p.dataKey === "systolic");
    const diastolic = payload.find((p) => p.dataKey === "diastolic");
    const glucose = payload.find((p) => p.dataKey === "level");

    return (
      <div
        className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg text-xs"
        style={{ minWidth: "120px" }}
      >
        <p className="font-bold text-gray-700 mb-2 border-b pb-1">{label}</p>
        {systolic && (
          <div className="flex items-center justify-between gap-3 text-red-600 mb-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              수축기(최고)
            </span>
            <span className="font-bold">{systolic.value}</span>
          </div>
        )}
        {diastolic && (
          <div className="flex items-center justify-between gap-3 text-blue-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              이완기(최저)
            </span>
            <span className="font-bold">{diastolic.value}</span>
          </div>
        )}
        {glucose && (
          <div className="flex items-center justify-between gap-3 text-teal-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>혈당
            </span>
            <span className="font-bold">{glucose.value}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// --- Custom Hook for Chart Scrolling ---
const useChartScroll = (totalLength, visibleCount = 12) => {
  const scrollContainerRef = useRef(null);
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, [totalLength]);
  return { scrollContainerRef };
};

// --- Data Constants (Empty) ---
const INITIAL_BP_DATA = [];
const INITIAL_GLUCOSE_DATA = [];

// --- File Download Helper (Using '혈압_혈당.json' fixed name) ---
const downloadCSV = (data, type) => {
  // This function exports CSV (Excel), kept for the "Excel Download" button
  let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
  if (type === "bp") {
    csvContent += "날짜,시간,수축기(최고),이완기(최저),혈압약 복용\n";
    data.forEach((row) => {
      csvContent += `${row.date},${row.time},${row.systolic},${row.diastolic},${
        row.medsTaken ? "복용함" : "미복용"
      }\n`;
    });
  } else {
    csvContent += "날짜,시간,측정 시점,혈당 수치(mg/dL),당뇨약 복용\n";
    const mealMap = {
      fasting: "공복 (아침 식전)",
      one_hour_after: "식후 1시간",
      breakfast_after: "아침 식후 2시간",
      lunch_after: "점심 식후 2시간",
      dinner_after: "저녁 식후 2시간",
      snack: "기타/간식 후",
    };
    data.forEach((row) => {
      csvContent += `${row.date},${row.time},${
        mealMap[row.mealStatus] || row.mealStatus
      },${row.level},${row.medsTaken ? "복용함" : "미복용"}\n`;
    });
  }
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `${type === "bp" ? "혈압" : "혈당"}_기록_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

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
    link.download = "혈압_혈당.json"; // Fixed filename
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
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
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

// --- AI Insight Component ---
function AIInsightSection({ profile, bpRecords, glucoseRecords }) {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateInsight = async () => {
    setLoading(true);
    setError(null);
    setInsight(null);

    const prompt = `
      역할: 전문적이고 친절한 건강 관리 코치
      사용자 정보:
      - 나이: ${
        profile.birthdate
          ? new Date().getFullYear() - new Date(profile.birthdate).getFullYear()
          : "미상"
      }세
      - 성별: ${profile.gender === "male" ? "남성" : "여성"}
      - 복용 약물: ${
        Object.entries(profile.meds)
          .filter(([_, v]) => v)
          .map(([k]) => k)
          .join(", ") || "없음"
      }

      최근 혈압 기록 (최신순 5개):
      ${
        bpRecords
          .slice(-5)
          .reverse()
          .map((r) => `- ${r.date} ${r.time}: ${r.systolic}/${r.diastolic}`)
          .join("\n") || "기록 없음"
      }

      최근 혈당 기록 (최신순 5개):
      ${
        glucoseRecords
          .slice(-5)
          .reverse()
          .map((r) => `- ${r.date} ${r.time} (${r.mealStatus}): ${r.level}`)
          .join("\n") || "기록 없음"
      }

      요청 사항:
      1. 현재 혈압과 혈당 수치에 대한 전반적인 평가를 해주세요.
      2. 주의해야 할 점이나 위험 신호가 있다면 알려주세요.
      3. 이 사용자에게 가장 필요한 식단(구체적인 음식 예시 포함)과 운동 가이드를 3가지씩 제안해주세요.
      4. 격려의 말로 마무리해주세요.
      5. 답변은 Markdown 형식으로 깔끔하게 정리해주세요. (헤더 사용 등)
      
      주의: 이 조언은 의료 전문가의 진단을 대신할 수 없음을 명시해주세요.
    `;

    const result = await callGeminiAPI(prompt);
    setLoading(false);
    if (
      result.startsWith("AI 서비스 연결 중 오류") ||
      result.startsWith("분석 결과를")
    ) {
      setError(result);
    } else {
      setInsight(result);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30">
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
              <BrainCircuit size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">AI 건강 코치 ✨</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            최근 기록된 혈압과 혈당 데이터를 분석하여
            <br />
            현재 상태에 딱 맞는 맞춤형 건강 가이드를 받아보세요.
          </p>
          <Button
            onClick={handleGenerateInsight}
            disabled={loading}
            variant="ai"
            className="w-full sm:w-auto px-8 py-3 text-lg shadow-indigo-200"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="animate-spin" size={20} /> 분석
                중입니다...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles size={20} /> 지금 바로 분석받기
              </span>
            )}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {insight && (
          <div className="mt-8 animate-fade-in">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm prose prose-sm sm:prose max-w-none">
              <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold border-b border-indigo-100 pb-2">
                <MessageSquare size={20} />
                <span>AI 분석 리포트</span>
              </div>
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {insight}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                * 본 분석 결과는 참고용이며, 정확한 진단과 처방은 반드시 의사와
                상담하시기 바랍니다.
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ... (ProfileSection, BPSection, GlucoseSection kept same) ...
function ProfileSection({
  profile,
  onChange,
  onMedToggle,
  onSave,
  onExport,
  onImport,
  onLoad,
}) {
  const [isEditing, setIsEditing] = useState(!profile.name);
  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };
  const getActiveMeds = () => {
    const meds = [];
    if (profile.meds.bp) meds.push("혈압약");
    if (profile.meds.diabetes) meds.push("당뇨약");
    if (profile.meds.lipid) meds.push("고지혈증약");
    if (profile.meds.aspirin) meds.push("아스피린");
    return meds;
  };

  if (!isEditing && profile.name) {
    return (
      <div className="space-y-6">
        <Card className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {profile.name}{" "}
                <span className="text-lg font-normal text-gray-500">
                  님의 건강 정보
                </span>
              </h2>
              <p className="text-gray-500 mt-1">
                {profile.gender === "male" ? "남성" : "여성"} ·{" "}
                {profile.birthdate
                  ? `만 ${calculateAge(profile.birthdate)}세`
                  : ""}{" "}
                ({profile.birthdate})
              </p>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="text-sm"
            >
              <Pencil size={16} /> 정보 수정
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                신체 정보
              </h3>
              <div className="flex gap-8">
                <div>
                  <span className="block text-2xl font-bold text-gray-900">
                    {profile.height || "-"}
                  </span>
                  <span className="text-sm text-gray-500">cm</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-gray-900">
                    {profile.weight || "-"}
                  </span>
                  <span className="text-sm text-gray-500">kg</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-500 mb-2 uppercase tracking-wide flex items-center gap-1">
                <Pill size={14} /> 복용 중인 약물
              </h3>
              <div className="flex flex-wrap gap-2">
                {getActiveMeds().length > 0 ? (
                  getActiveMeds().map((med, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm font-medium shadow-sm border border-blue-100"
                    >
                      {med}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">
                    기록된 약물이 없습니다.
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
        <BackupRestoreCard
          onExport={onExport}
          onImport={onImport}
          onSave={onSave}
          onLoad={onLoad}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-blue-200 ring-4 ring-blue-50/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <User className="text-blue-500" /> 기본 정보 입력
          </h2>
          {profile.name && (
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="이름"
            value={profile.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="홍길동"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              생년월일
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={profile.birthdate}
                onChange={(e) => onChange("birthdate", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <span className="flex items-center px-3 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 min-w-[4rem] justify-center">
                {profile.birthdate
                  ? `${calculateAge(profile.birthdate)}세`
                  : "-세"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="키 (cm)"
              type="number"
              value={profile.height}
              onChange={(e) => onChange("height", e.target.value)}
              placeholder="170"
            />
            <Input
              label="몸무게 (kg)"
              type="number"
              value={profile.weight}
              onChange={(e) => onChange("weight", e.target.value)}
              placeholder="65"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">성별</label>
            <select
              value={profile.gender}
              onChange={(e) => onChange("gender", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
        </div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Pill size={16} /> 복용 중인 약물 체크
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Checkbox
              label="혈압약 (고혈압 치료제)"
              checked={profile.meds.bp}
              onChange={() => onMedToggle("bp")}
            />
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Checkbox
              label="당뇨약 (혈당 강하제/인슐린)"
              checked={profile.meds.diabetes}
              onChange={() => onMedToggle("diabetes")}
            />
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Checkbox
              label="고지혈증약"
              checked={profile.meds.lipid}
              onChange={() => onMedToggle("lipid")}
            />
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Checkbox
              label="아스피린 (혈전 예방)"
              checked={profile.meds.aspirin}
              onChange={() => onMedToggle("aspirin")}
            />
          </div>
        </div>
        <Button
          onClick={() => {
            onSave();
            setIsEditing(false);
          }}
          variant="success"
          className="w-full py-3 text-lg"
        >
          <Check size={20} /> 정보 저장 완료
        </Button>
      </Card>
      <BackupRestoreCard
        onExport={onExport}
        onImport={onImport}
        onSave={onSave}
        onLoad={onLoad}
      />
    </div>
  );
}

// --- Sub-Component: BP Section ---
function BPSection({ records, onAdd, onUpdate, onDelete, onDownload }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const { scrollContainerRef } = useChartScroll(records.length, 12);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [input, setInput] = useState({
    date: "",
    time: "",
    systolic: "",
    diastolic: "",
    medsTaken: false,
  });

  const openModal = (record = null) => {
    if (record) {
      setEditId(record.id);
      setInput(record);
    } else {
      setEditId(null);
      const now = new Date();
      // 한국 시간(KST) 기준으로 날짜 및 시간 계산
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setInput({
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`,
        systolic: "",
        diastolic: "",
        medsTaken: false,
      });
    }
    setIsModalOpen(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.systolic || !input.diastolic) return;
    if (editId) onUpdate({ ...input, id: editId });
    else onAdd(input);
    setIsModalOpen(false);
  };
  const handleDeleteClick = (id) => setDeleteId(id);
  const confirmDelete = () => {
    if (deleteId) onDelete("bp", deleteId);
    setDeleteId(null);
  };

  const chartData = useMemo(() => {
    return records.map((r) => ({
      name: `${r.date.slice(5)} ${r.time}`,
      systolic: parseInt(r.systolic),
      diastolic: parseInt(r.diastolic),
    }));
  }, [records]);

  // Fixed Y-Axis Domain and Ticks (40~180, step 20)
  const yDomain = [40, 180];
  const yTicks = [40, 60, 80, 100, 120, 140, 160, 180];

  const sortedRecords = useMemo(() => [...records].reverse(), [records]);
  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage);
  const currentRecords = useMemo(
    () =>
      sortedRecords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [sortedRecords, currentPage]
  );
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  return (
    <div className="space-y-6">
      {/* Chart */}
      <Card className="p-6 h-[850px] flex flex-col">
        <div className="flex justify-between items-center mb-2 flex-none">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
              <Activity size={18} /> 혈압 추이
            </h2>
            <p className="text-sm text-gray-500">
              녹색 영역은 정상 혈압(120/80 미만) 범위입니다.
            </p>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              수축기(최고)
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              이완기(최저)
            </div>
          </div>
        </div>

        <div className="flex w-full h-[700px] border border-gray-100 rounded-lg relative">
          {/* 1. Fixed Left Side: Y-Axis */}
          <div className="w-[60px] h-full bg-white z-10 border-r border-gray-100 flex-none relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                margin={{ top: 20, right: 0, bottom: 10, left: 0 }}
                data={chartData}
              >
                <YAxis
                  domain={yDomain}
                  ticks={yTicks}
                  width={60}
                  tick={<CustomYAxisTick />}
                  axisLine={false}
                  tickLine={false}
                />
                {/* Invisible XAxis to reserve identical bottom space */}
                <XAxis height={70} tick={false} axisLine={false} />
                <Line dataKey="systolic" stroke="none" />
              </LineChart>
            </ResponsiveContainer>
            {/* Y-Axis Unit at bottom left */}
            <div className="absolute bottom-12 left-0 w-full text-center text-[10px] text-gray-400 font-medium">
              (mmHg)
            </div>
          </div>
          {/* 2. Scrollable Right Side */}
          <div
            ref={scrollContainerRef}
            className="flex-1 h-full overflow-x-auto overflow-y-hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div
              style={{
                height: "100%",
                minWidth: "100%",
                width: `${Math.max(100, (chartData.length / 12) * 100)}%`,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  {/* Reduced padding to 13px */}
                  <XAxis
                    dataKey="name"
                    tick={<CustomXAxisTick data={chartData} />}
                    interval={0}
                    height={70}
                    axisLine={false}
                    tickLine={false}
                    padding={{ left: 13, right: 13 }}
                  />
                  {/* Added ticks to hidden YAxis to force matching grid lines */}
                  <YAxis domain={yDomain} ticks={yTicks} hide />
                  {/* Using CustomTooltip defined previously */}
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: "#e5e7eb" }}
                    position={{ y: 50 }}
                  />
                  <ReferenceArea
                    y1={60}
                    y2={80}
                    fill="green"
                    fillOpacity={0.12}
                  />
                  <ReferenceArea
                    y1={90}
                    y2={120}
                    fill="green"
                    fillOpacity={0.12}
                  />
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={<CustomBPDot dataKey="systolic" />}
                    activeDot={{ r: 8 }}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolic"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={<CustomBPDot dataKey="diastolic" />}
                    activeDot={{ r: 8 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full justify-end mt-4 pt-4 border-t border-gray-100 flex-none">
          <Button
            onClick={onDownload}
            variant="outline"
            className="flex-1 sm:flex-none border-green-600 text-green-700 hover:bg-green-50 whitespace-nowrap"
          >
            <Download size={18} /> 엑셀 다운로드
          </Button>
          <Button
            onClick={() => openModal()}
            className="flex-1 sm:flex-none shadow-md hover:shadow-lg transition-shadow whitespace-nowrap"
          >
            <Plus size={18} /> 혈압 입력
          </Button>
        </div>
        <ReferenceGuide type="bp" />
      </Card>

      {/* History List */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">최근 기록</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-2 py-2 rounded-l-lg whitespace-nowrap text-center">
                  날짜/시간
                </th>
                <th className="px-2 py-2 whitespace-nowrap text-center">
                  수축기
                </th>
                <th className="px-2 py-2 whitespace-nowrap text-center">
                  이완기
                </th>
                <th className="px-2 py-2 whitespace-nowrap text-center">
                  상태
                </th>
                <th className="px-2 py-2 whitespace-nowrap text-center">
                  약 복용
                </th>
                <th className="px-2 py-2 rounded-r-lg whitespace-nowrap text-center">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentRecords.map((record) => {
                const isHigh = record.systolic >= 140 || record.diastolic >= 90;
                const isNormal = record.systolic < 120 && record.diastolic < 80;
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2 whitespace-nowrap text-center">
                      <div className="flex flex-col justify-center">
                        <span className="font-medium text-gray-900">
                          {record.date}
                        </span>
                        <span className="text-xs text-gray-400">
                          {record.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2 font-medium text-red-600 text-center">
                      {record.systolic}
                    </td>
                    <td className="px-2 py-2 font-medium text-blue-600 text-center">
                      {record.diastolic}
                    </td>
                    <td className="px-2 py-2 text-center">
                      {isHigh ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold inline-block">
                          고혈압 주의
                        </span>
                      ) : isNormal ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold inline-block">
                          정상
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold inline-block">
                          주의
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center">
                      {record.medsTaken ? (
                        <span className="flex items-center justify-center gap-1 text-green-600">
                          <Pill size={14} /> 복용함
                        </span>
                      ) : (
                        <span className="text-gray-400">미복용</span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(record)}
                          className="text-gray-400 hover:text-blue-600 p-1"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(record.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Card>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editId ? "기록 수정하기" : "혈압 기록하기"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="날짜"
              type="date"
              value={input.date}
              onChange={(e) => setInput({ ...input, date: e.target.value })}
              required
            />
            <Input
              label="시간"
              type="time"
              value={input.time}
              onChange={(e) => setInput({ ...input, time: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="수축기 (최고)"
              type="number"
              placeholder="120"
              value={input.systolic}
              onChange={(e) => setInput({ ...input, systolic: e.target.value })}
              required
            />
            <Input
              label="이완기 (최저)"
              type="number"
              placeholder="80"
              value={input.diastolic}
              onChange={(e) =>
                setInput({ ...input, diastolic: e.target.value })
              }
              required
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Checkbox
              label="혈압약 복용 완료"
              checked={input.medsTaken}
              onChange={(e) =>
                setInput({ ...input, medsTaken: e.target.checked })
              }
            />
          </div>
          <Button type="submit" className="w-full h-12 text-lg">
            {editId ? "수정 저장" : "기록 저장"}
          </Button>
        </form>
      </Modal>
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="삭제 확인"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center text-red-500">
            <AlertCircle size={48} />
          </div>
          <p className="text-gray-700">
            이 기록을 삭제하시겠습니까?
            <br />
            삭제된 데이터는 복구할 수 없습니다.
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <Button
              variant="secondary"
              onClick={() => setDeleteId(null)}
              className="w-full"
            >
              취소
            </Button>
            <Button variant="danger" onClick={confirmDelete} className="w-full">
              삭제
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// --- Sub-Component: Glucose Section ---
function GlucoseSection({ records, onAdd, onUpdate, onDelete, onDownload }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const { scrollContainerRef } = useChartScroll(records.length, 12);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [input, setInput] = useState({
    date: "",
    time: "",
    level: "",
    mealStatus: "fasting",
    medsTaken: false,
  });
  const mealOptions = [
    { value: "fasting", label: "공복 (아침 식전)" },
    { value: "one_hour_after", label: "식후 1시간" },
    { value: "breakfast_after", label: "아침 식후 2시간" },
    { value: "lunch_after", label: "점심 식후 2시간" },
    { value: "dinner_after", label: "저녁 식후 2시간" },
    { value: "snack", label: "기타/간식 후" },
  ];

  // ... (openModal, handleSubmit, handlers same as before) ...
  const openModal = (record = null) => {
    if (record) {
      setEditId(record.id);
      setInput(record);
    } else {
      setEditId(null);
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setInput({
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`,
        level: "",
        mealStatus: "fasting",
        medsTaken: false,
      });
    }
    setIsModalOpen(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.level) return;
    if (editId) onUpdate({ ...input, id: editId });
    else onAdd(input);
    setIsModalOpen(false);
  };
  const confirmDelete = () => {
    if (deleteId) onDelete("glucose", deleteId);
    setDeleteId(null);
  };

  const chartData = useMemo(() => {
    return records.map((r) => ({
      name: `${r.date.slice(5)} ${r.time}`,
      level: parseInt(r.level),
      status: mealOptions.find((o) => o.value === r.mealStatus)?.label,
      mealStatus: r.mealStatus,
    }));
  }, [records]);

  // Fixed Y-Axis Domain and Ticks for Glucose (0~300, step 50)
  const yDomain = [0, 300];
  const yTicks = [0, 50, 100, 150, 200, 250, 300];

  const sortedRecords = useMemo(() => [...records].reverse(), [records]);
  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage);
  const currentRecords = useMemo(
    () =>
      sortedRecords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [sortedRecords, currentPage]
  );
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  return (
    <div className="space-y-6">
      {/* Chart - Height Increased to 750px */}
      <Card className="p-6 h-[850px] flex flex-col">
        <div className="flex justify-between items-center mb-2 flex-none">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
              <Activity size={18} /> 혈당 추이
            </h2>
            <p className="text-sm text-gray-500">
              녹색 영역은 일반적인 관리 목표(70~140mg/dL)입니다.
            </p>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-teal-600"></div>혈당
            </div>
          </div>
        </div>
        {/* Chart Container Height 700px */}
        <div className="flex w-full h-[700px] border border-gray-100 rounded-lg relative">
          <div className="w-[60px] h-full bg-white z-10 border-r border-gray-100 flex-none relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                margin={{ top: 20, right: 0, bottom: 10, left: 0 }}
                data={chartData}
              >
                <YAxis
                  domain={yDomain}
                  ticks={yTicks}
                  width={60}
                  tick={<CustomYAxisTick />}
                  axisLine={false}
                  tickLine={false}
                />
                {/* Invisible XAxis to reserve identical bottom space */}
                <XAxis height={70} tick={false} axisLine={false} />
                <Line dataKey="level" stroke="none" />
              </LineChart>
            </ResponsiveContainer>
            {/* Y-Axis Unit at bottom left */}
            <div className="absolute bottom-12 left-0 w-full text-center text-[10px] text-gray-400 font-medium">
              (mg/dL)
            </div>
          </div>
          <div
            ref={scrollContainerRef}
            className="flex-1 h-full overflow-x-auto overflow-y-hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div
              style={{
                height: "100%",
                minWidth: "100%",
                width: `${Math.max(100, (chartData.length / 12) * 100)}%`,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  {/* Reduced padding to 13px */}
                  <XAxis
                    dataKey="name"
                    tick={<CustomXAxisTick data={chartData} />}
                    interval={0}
                    height={70}
                    axisLine={false}
                    tickLine={false}
                    padding={{ left: 13, right: 13 }}
                  />
                  {/* Added ticks to hidden YAxis to force matching grid lines */}
                  <YAxis domain={yDomain} ticks={yTicks} hide />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: "#e5e7eb" }}
                    position={{ y: 50 }}
                  />
                  <ReferenceArea
                    y1={70}
                    y2={140}
                    fill="green"
                    fillOpacity={0.12}
                  />
                  <Line
                    type="monotone"
                    dataKey="level"
                    stroke="#0d9488"
                    strokeWidth={2}
                    dot={<CustomGlucoseDot />}
                    activeDot={{ r: 8 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full justify-end mt-4 pt-4 border-t border-gray-100 flex-none">
          <Button
            onClick={onDownload}
            variant="outline"
            className="flex-1 sm:flex-none border-teal-600 text-teal-700 hover:bg-teal-50 whitespace-nowrap"
          >
            <Download size={18} /> 엑셀 다운로드
          </Button>
          <Button
            onClick={() => openModal()}
            variant="primary"
            className="flex-1 sm:flex-none shadow-md hover:shadow-lg transition-shadow bg-teal-600 hover:bg-teal-700 whitespace-nowrap"
          >
            <Plus size={18} /> 혈당 입력
          </Button>
        </div>
        <ReferenceGuide type="glucose" />
      </Card>
      {/* ... (History List and Modals kept same) ... */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">최근 기록</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-2 py-2 text-center">날짜/시간</th>
                <th className="px-2 py-2 text-center">측정 시점</th>
                <th className="px-2 py-2 text-center">혈당 수치</th>
                <th className="px-2 py-2 text-center">상태 평가</th>
                <th className="px-2 py-2 text-center">약/인슐린</th>
                <th className="px-2 py-2 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentRecords.map((record) => {
                const mealLabel = mealOptions.find(
                  (o) => o.value === record.mealStatus
                )?.label;
                const level = parseInt(record.level);
                let statusColor = "text-gray-900";
                let statusText = "-";
                if (record.mealStatus === "fasting") {
                  if (level < 70) {
                    statusText = "저혈당";
                    statusColor = "text-red-600 font-bold";
                  } else if (level <= 100) {
                    statusText = "정상";
                    statusColor = "text-green-600 font-bold";
                  } else if (level <= 125) {
                    statusText = "주의";
                    statusColor = "text-yellow-600 font-bold";
                  } else {
                    statusText = "높음";
                    statusColor = "text-red-600 font-bold";
                  }
                } else {
                  if (level > 180) {
                    statusText = "높음";
                    statusColor = "text-red-600 font-bold";
                  } else if (level < 70) {
                    statusText = "저혈당";
                    statusColor = "text-red-600 font-bold";
                  } else {
                    statusText = "양호";
                    statusColor = "text-green-600 font-bold";
                  }
                }
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2 whitespace-nowrap text-center">
                      <div className="flex flex-col justify-center">
                        <span className="font-medium text-gray-900">
                          {record.date}
                        </span>
                        <span className="text-xs text-gray-400">
                          {record.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-center text-xs">
                      {mealLabel}
                    </td>
                    <td
                      className={`px-2 py-2 text-lg text-center whitespace-nowrap ${statusColor}`}
                    >
                      {record.level}
                    </td>
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      <span
                        className={`text-xs px-2 py-1 rounded bg-opacity-20 inline-block ${
                          statusColor.includes("red")
                            ? "bg-red-100 text-red-700"
                            : statusColor.includes("green")
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {statusText}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      {record.medsTaken ? (
                        <span className="flex items-center justify-center gap-1 text-teal-600">
                          <Pill size={14} /> 복용함
                        </span>
                      ) : (
                        <span className="text-gray-400">미복용</span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(record)}
                          className="text-gray-400 hover:text-blue-600 p-1"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(record.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Card>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editId ? "기록 수정하기" : "혈당 기록하기"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="날짜"
              type="date"
              value={input.date}
              onChange={(e) => setInput({ ...input, date: e.target.value })}
              required
            />
            <Input
              label="시간"
              type="time"
              value={input.time}
              onChange={(e) => setInput({ ...input, time: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              측정 시점
            </label>
            <select
              value={input.mealStatus}
              onChange={(e) =>
                setInput({ ...input, mealStatus: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              {mealOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="혈당 수치 (mg/dL)"
            type="number"
            placeholder="100"
            value={input.level}
            onChange={(e) => setInput({ ...input, level: e.target.value })}
            required
          />
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Checkbox
              label="당뇨약/인슐린 복용(투여)"
              checked={input.medsTaken}
              onChange={(e) =>
                setInput({ ...input, medsTaken: e.target.checked })
              }
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full h-12 text-lg bg-teal-600 hover:bg-teal-700"
          >
            {editId ? "수정 저장" : "기록 저장"}
          </Button>
        </form>
      </Modal>
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="삭제 확인"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center text-red-500">
            <AlertCircle size={48} />
          </div>
          <p className="text-gray-700">
            이 기록을 삭제하시겠습니까?
            <br />
            삭제된 데이터는 복구할 수 없습니다.
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <Button
              variant="secondary"
              onClick={() => setDeleteId(null)}
              className="w-full"
            >
              취소
            </Button>
            <Button variant="danger" onClick={confirmDelete} className="w-full">
              삭제
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
