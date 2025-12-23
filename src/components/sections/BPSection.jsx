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
import { CustomYAxisTick, CustomXAxisTick, CustomBPDot, CustomTooltip } from '../charts';
import { useChartScroll } from '../../hooks/useChartScroll';

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

    const confirmDelete = () => {
        if (deleteId) onDelete(deleteId);
        setDeleteId(null);
    };

    const chartData = useMemo(() => {
        return records.map((r) => ({
            name: `${r.date.slice(5)} ${r.time}`,
            systolic: parseInt(r.systolic),
            diastolic: parseInt(r.diastolic),
        }));
    }, [records]);

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
                                <Line dataKey="systolic" stroke="none" />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="absolute bottom-12 left-0 w-full text-center text-[10px] text-gray-400 font-medium">
                            (mmHg)
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
                            enterKeyHint="done"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    e.target.blur();
                                }
                            }}
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
                            enterKeyHint="done"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    e.target.blur();
                                }
                            }}
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

export default BPSection;
