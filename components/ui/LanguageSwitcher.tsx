"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!mounted) return;
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, mounted]);

  // 마운트 전에는 렌더링하지 않음 (hydration 에러 방지)
  if (!mounted) {
    return (
      <div className="relative">
        <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border-2 border-gray-300 rounded-lg">
          <span className="text-xl">🌐</span>
        </div>
      </div>
    );
  }

  const languages = [
    { code: "ko" as const, label: t("language.korean"), flag: "🇰🇷" },
    { code: "en" as const, label: t("language.english"), flag: "🇺🇸" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors shadow-lg backdrop-blur-sm"
        aria-label={t("language.selectLanguage")}
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          {currentLanguage.label}
        </span>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-blue-50 transition-colors ${
                  language === lang.code ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm text-gray-700">{lang.label}</span>
                {language === lang.code && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

