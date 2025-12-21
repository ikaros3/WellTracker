import React from 'react';
import { Info } from 'lucide-react';

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

export default ReferenceGuide;
