import React, { useState } from 'react';
import { User, Pencil, X, Check, Pill } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Checkbox from '../common/Checkbox';

function ProfileSection({
    profile,
    onChange,
    onMedToggle,
    onSave,
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
        </div>
    );
}

export default ProfileSection;
