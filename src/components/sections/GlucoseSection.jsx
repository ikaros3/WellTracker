import React, { useState, useMemo, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea,
} from 'recharts';
import {
    Activity,
    Plus,
    Pencil,
    Trash2,
    Pill,
    Download,
    AlertCircle,
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Checkbox from '../common/Checkbox';
import Modal from '../common/Modal';
import PaginationControls from '../common/PaginationControls';
import ReferenceGuide from './ReferenceGuide';
import { CustomYAxisTick, CustomXAxisTick, CustomGlucoseDot, CustomTooltip } from '../charts';
import { useChartScroll } from '../../hooks/useChartScroll';
import { mealOptions } from '../../constants';

const REF_RANGES = {
    fasting: {
        normal: { y1: 70, y2: 99, color: "green", label: "정상" },
        pre: { y1: 100, y2: 125, color: "orange", label: "전단계" },
        danger: { y1: 126, y2: 300, color: "red", label: "관리필요" }
    },
    one_hour_after: {
        normal: { y1: 70, y2: 179, color: "green", label: "정상" },
        pre: { y1: 180, y2: 199, color: "orange", label: "전단계" },
        danger: { y1: 200, y2: 300, color: "red", label: "관리필요" }
    },
    two_hour_after: {
        normal: { y1: 70, y2: 139, color: "green", label: "정상" },
        pre: { y1: 140, y2: 199, color: "orange", label: "전단계" },
        danger: { y1: 200, y2: 300, color: "red", label: "관리필요" }
    },
    all: {
        normal: { y1: 70, y2: 140, color: "green", label: "일반 관리 목표" }
    }
};

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
    const [filter, setFilter] = useState("all");

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
        if (deleteId) onDelete(deleteId);
        setDeleteId(null);
    };

    // Shared filtered records based on active filter
    const filteredRecords = useMemo(() => {
        if (filter === "fasting") {
            return records.filter((r) => r.mealStatus === "fasting");
        } else if (filter === "one_hour_after") {
            return records.filter((r) => r.mealStatus === "one_hour_after");
        } else if (filter === "two_hour_after") {
            return records.filter((r) =>
                ["breakfast_after", "lunch_after", "dinner_after"].includes(r.mealStatus)
            );
        }
        return records;
    }, [records, filter]);

    const chartData = useMemo(() => {
        return filteredRecords.map((r) => ({
            name: `${r.date.slice(5)} ${r.time}`,
            level: parseInt(r.level),
            status: mealOptions.find((o) => o.value === r.mealStatus)?.label,
            mealStatus: r.mealStatus,
            date: r.date,
        }));
    }, [filteredRecords]);

    const yDomain = [0, 300];
    const yTicks = [0, 50, 100, 150, 200, 250, 300];

    const sortedRecords = useMemo(() => [...filteredRecords].reverse(), [filteredRecords]);
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
            <Card className="p-6 h-[950px] flex flex-col">
                <div className="flex justify-between items-center mb-2 flex-none">
                    <div>
                        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                            <Activity size={18} /> 혈당 추이
                        </h2>
                        <div className="flex gap-2 mt-1">
                            {Object.values(REF_RANGES[filter] || REF_RANGES.all).map((range, idx) => (
                                <span key={idx} className="text-xs flex items-center gap-1 text-gray-500">
                                    <span className={`w-2 h-2 rounded-full ${range.color === 'green' ? 'bg-green-500' :
                                        range.color === 'orange' ? 'bg-orange-400' : 'bg-red-400'
                                        }`}></span>
                                    {range.label} ({range.y1}~{range.y2})
                                </span>
                            ))}
                        </div>
                    </div>
                    {/* Average Display */}
                    <div className="flex gap-4">
                        {[
                            { days: 7, label: "7일" },
                            { days: 14, label: "14일", main: true },
                            { days: 30, label: "30일" },
                        ].map(({ days, label, main }) => {
                            // Helper to calculate difference in days
                            const getDiffDays = (date1, date2) => {
                                const d1 = new Date(date1);
                                const d2 = new Date(date2);
                                // Normalize to start of day to ignore time
                                d1.setHours(0, 0, 0, 0);
                                d2.setHours(0, 0, 0, 0);
                                const diffTime = Math.abs(d2 - d1);
                                return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            };

                            const todayDate = new Date();
                            const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;

                            // Determine Baseline Date for Average (Latest Date in Data or Today)
                            // User Request: Use the last recorded date as the anchor for 7/14/30 days window.
                            let baselineDateStr = todayStr;

                            // 1. Filter by Condition (Meal Status)
                            // Use the outer 'filteredRecords' which is already filtered by meal status.
                            const targetRecords = filteredRecords;

                            if (targetRecords.length > 0) {
                                // Find the latest date in the filtered records
                                baselineDateStr = targetRecords.reduce((max, r) => r.date > max ? r.date : max, targetRecords[0].date);
                            }

                            // 2. Filter by Date (Last N days from Baseline)
                            const recentRecords = targetRecords.filter((r) => {
                                if (!r.date) return false;

                                // User requested baseline to be the last recorded date.
                                // But if user enters future date by mistake? 
                                // baselineDateStr is max of all records, so if there is future data, baseline moves to future.
                                // That's probably intended behavior if we strictly follow "last date".
                                // However, we should still ensure we don't pick up records *after* the baseline (which is impossible if baseline is max).

                                return getDiffDays(baselineDateStr, r.date) < days;
                            });

                            const avg = recentRecords.length
                                ? Math.round(
                                    recentRecords.reduce((acc, r) => acc + parseInt(r.level), 0) /
                                    recentRecords.length
                                )
                                : "-";



                            return (
                                <div
                                    key={days}
                                    className={`flex flex-col items-center ${main ? "text-teal-700" : "text-gray-400"}`}
                                >
                                    <span className={`text-[10px] ${main ? "font-bold" : ""}`}>{label} 평균</span>
                                    <span className={`text-sm ${main ? "font-bold" : "font-medium"}`}>
                                        {avg}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-slate-100 p-1 rounded-xl mb-6 grid grid-cols-4 gap-1">
                    {[
                        { key: "all", label: "전체" },
                        { key: "fasting", label: "공복" },
                        { key: "one_hour_after", label: "식후 1시간" },
                        { key: "two_hour_after", label: "식후 2시간" },
                    ].map((opt) => (
                        <button
                            key={opt.key}
                            onClick={() => setFilter(opt.key)}
                            className={`py-2 px-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${filter === opt.key
                                ? "bg-white text-teal-700 shadow-sm shadow-slate-200 ring-1 ring-black/5"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div className="flex w-full h-[800px] border border-gray-100 rounded-lg relative">
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
                                <XAxis height={70} tick={false} axisLine={false} />
                                <Line dataKey="level" stroke="none" />
                            </LineChart>
                        </ResponsiveContainer>
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
                                    <XAxis
                                        dataKey="name"
                                        tick={<CustomXAxisTick data={chartData} />}
                                        interval={0}
                                        height={70}
                                        axisLine={false}
                                        tickLine={false}
                                        padding={{ left: 13, right: 13 }}
                                    />
                                    <YAxis domain={yDomain} ticks={yTicks} hide />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ stroke: "#e5e7eb" }}
                                        position={{ y: 50 }}
                                    />
                                    {Object.values(REF_RANGES[filter] || REF_RANGES.all).map((range, idx) => (
                                        <ReferenceArea
                                            key={idx}
                                            y1={range.y1}
                                            y2={range.y2}
                                            fill={range.color}
                                            fillOpacity={range.color === 'red' ? 0.05 : 0.1}
                                        />
                                    ))}
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

            {/* History List */}
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
                                    if (level < 60) {
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
                                    } else if (level < 60) {
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
                                                className={`text-xs px-2 py-1 rounded bg-opacity-20 inline-block ${statusColor.includes("red")
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
                        enterKeyHint="done"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                e.target.blur();
                            }
                        }}
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

export default GlucoseSection;
