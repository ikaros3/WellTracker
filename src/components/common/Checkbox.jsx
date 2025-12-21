import React from 'react';

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

export default Checkbox;
