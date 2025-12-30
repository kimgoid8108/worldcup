/**
 * 메인 페이지 (홈)
 *
 * 용도: 2026 북중미 월드컵 정보를 표시하는 메인 페이지
 * - 프리미엄 시네마틱 인트로 (2단계)
 * - 탭 네비게이션: "포트" / "조 경기" / "경기장"
 * - PotsTab: 포트별 팀 정보 표시
 * - GroupsTab: 조별 경기 정보 표시
 * - StadiumsTab: 경기장 목록 및 지도 표시
 *
 * 경로: / (루트 경로)
 */

"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tabs from "@/components/Tabs";
import PotsTab from "@/components/PotsTab";
import GroupsTab from "@/components/GroupsTab";
import StadiumsTab from "@/components/StadiumsTab";
import { countries } from "@/data/countries";
import { stadiums } from "@/data/stadiums";
import { groups } from "@/data/groups";

// 상수 정의
const HOST_NATIONS = [
  { code: "USA", name: "USA", flag: "🇺🇸" },
  { code: "MEX", name: "MEXICO", flag: "🇲🇽" },
  { code: "CAN", name: "CANADA", flag: "🇨🇦" },
] as const;

const TITLE_STYLE = {
  fontFamily: "'Arial Black', sans-serif",
  textShadow: "0 0 40px rgba(255, 215, 0, 0.5), 0 0 80px rgba(255, 215, 0, 0.3)",
  letterSpacing: "-0.02em",
} as const;

const NATION_NAME_STYLE = {
  textShadow: "0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3)",
  fontFamily: "'Arial Black', sans-serif",
} as const;

const BUTTON_STYLE = {
  boxShadow: "0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2)",
} as const;

// 애니메이션 설정
const FLAG_ANIMATION = {
  scale: [1, 1.1, 1],
  rotate: [0, 5, -5, 0],
} as const;

const FLAG_TRANSITION = {
  duration: 2,
  repeat: Infinity,
  repeatDelay: 1,
} as const;

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState<"pots" | "groups" | "stadiums">("groups");

  const introVideoRef = useRef<HTMLVideoElement>(null);

  // 핸들러 최적화
  const handleSkipIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  // 비디오 에러 처리
  useEffect(() => {
    if (!introVideoRef.current) return;

    const handleError = (e: Event) => {
      console.error("비디오 로드 실패:", e);
    };

    introVideoRef.current.addEventListener("error", handleError);
    return () => introVideoRef.current?.removeEventListener("error", handleError);
  }, []);

  // 계산된 값 메모이제이션
  const statsText = useMemo(() => `Road to 2026: ${countries.length} Nations | ${stadiums.length} Host Cities`, []);

  return (
    <>
      <AnimatePresence>
        {showIntro ? (
          <motion.div key="intro" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="fixed inset-0 z-50 bg-black">
            {/* Phase 1: The Preparation (introvideo) */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              {/* 배경 비디오 */}
              <video ref={introVideoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
                <source src="/videos/introvideo.mp4" type="video/mp4" />
              </video>

              {/* 오버레이 그라데이션 */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />

              {/* 메인 콘텐츠 */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
                {/* 메인 타이틀 */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                  className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 tracking-tight"
                  style={TITLE_STYLE}>
                  BEYOND
                  <br />
                  THE LIMITS
                </motion.h1>

                {/* 데이터 정보 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="text-xl md:text-2xl text-gray-300 mb-12 font-light tracking-wider">
                  {statsText}
                </motion.div>

                {/* NEXT 버튼 */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSkipIntro}
                  className="px-12 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold text-lg md:text-xl rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 uppercase tracking-wider"
                  style={BUTTON_STYLE}>
                  NEXT
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          // 메인 대시보드
          <motion.main
            key="main"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-green-50">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="max-w-7xl mx-auto">
              {/* 헤더: 제목 */}
              <div className="flex justify-center items-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800">2026 북중미 월드컵</h1>
              </div>

              {/* 탭 네비게이션 */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
                <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
              </motion.div>

              {/* 탭별 컨텐츠 */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="mt-6">
                {activeTab === "pots" ? <PotsTab /> : activeTab === "groups" ? <GroupsTab /> : <StadiumsTab />}
              </motion.div>
            </motion.div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
