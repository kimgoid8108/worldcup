/**
 * SearchBar 컴포넌트
 *
 * 용도: 재사용 가능한 검색 입력 필드 컴포넌트
 */

"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "검색...",
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-800"
      />
      <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
    </div>
  );
}

