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
import Link from "next/link";
import Tabs from "@/components/tabs/Tabs";
import PotsTab from "@/components/tabs/PotsTab";
import GroupsTab from "@/components/tabs/GroupsTab";
import StadiumsTab from "@/components/tabs/StadiumsTab";
import StadiumModal from "@/components/modals/StadiumModal";
import FifaRankingsTab from "@/components/tabs/FifaRankingsTab";
import { countries } from "@/data/countries";
import { stadiums } from "@/data/stadiums";
import { groups } from "@/data/groups";
import Flag from "@/components/ui/Flag";

// 상수 정의
const HOST_NATIONS = [
  { code: "USA", name: "USA", flag: "🇺🇸" },
  { code: "MEX", name: "MEXICO", flag: "🇲🇽" },
  { code: "CAN", name: "CANADA", flag: "🇨🇦" },
] as const;

const TITLE_STYLE = {
  fontFamily: "'Arial Black', sans-serif",
  textShadow:
    "0 0 40px rgba(255, 215, 0, 0.5), 0 0 80px rgba(255, 215, 0, 0.3)",
  letterSpacing: "-0.02em",
} as const;

const NATION_NAME_STYLE = {
  textShadow:
    "0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3)",
  fontFamily: "'Arial Black', sans-serif",
} as const;

const BUTTON_STYLE = {
  boxShadow:
    "0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2)",
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
  // hydration 에러 방지를 위해 초기값을 null로 설정
  const [showIntro, setShowIntro] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<
    "pots" | "groups" | "stadiums" | "fifarankings"
  >("groups");

  // 선택된 경기장 ID (모달 표시용)
  const [selectedStadium, setSelectedStadium] = useState<string | null>(null);

  const introVideoRef = useRef<HTMLVideoElement>(null);

  // localStorage에서 introSeen 값 확인 (클라이언트에서만 실행)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const introSeen = localStorage.getItem("introSeen");
      // introSeen이 없거나 false이면 Intro 표시, true이면 건너뛰기
      setShowIntro(introSeen !== "true");
    }
  }, []);

  // 핸들러 최적화
  const handleSkipIntro = useCallback(() => {
    // localStorage에 introSeen = true 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("introSeen", "true");
    }
    setShowIntro(false);
  }, []);

  // 비디오 에러 처리
  useEffect(() => {
    if (!introVideoRef.current) return;

    const handleError = (e: Event) => {
      console.error("비디오 로드 실패:", e);
    };

    introVideoRef.current.addEventListener("error", handleError);
    return () =>
      introVideoRef.current?.removeEventListener("error", handleError);
  }, []);

  // 계산된 값 메모이제이션
  const statsText = useMemo(
    () =>
      `Road to 2026: ${countries.length} Nations | ${stadiums.length} Host Cities`,
    []
  );

  // hydration 완료 전에는 아무것도 렌더링하지 않음 (hydration 에러 방지)
  if (showIntro === null) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 bg-black"
          >
            {/* Phase 1: The Preparation (introvideo) */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              {/* 배경 비디오 */}
              <video
                ref={introVideoRef}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              >
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
                  style={TITLE_STYLE}
                >
                  BEYOND
                  <br />
                  THE LIMITS
                </motion.h1>

                {/* 데이터 정보 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="text-xl md:text-2xl text-gray-300 mb-12 font-light tracking-wider"
                >
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
                  style={BUTTON_STYLE}
                >
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
            className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden"
          >
            {/* 배경 국기 애니메이션 - 양쪽 사이드만 (데스크톱에서만 표시) */}
            <div className="hidden md:block fixed inset-0 z-0 pointer-events-none opacity-50">
              {/* 왼쪽 사이드 */}
              <div className="absolute top-0 left-4 md:left-8 lg:left-12 h-full w-24 md:w-32">
                <motion.div
                  className="flex flex-col gap-12 items-center"
                  animate={{
                    y: [0, -2000],
                  }}
                  transition={{
                    duration: 35,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {/* 국기들을 두 번 반복하여 무한 스크롤 효과 */}
                  {[...countries, ...countries].map((country, index) => (
                    <motion.div
                      key={`left-${country.id}-${index}`}
                      className="flex-shrink-0"
                      whileHover={{ scale: 1.2 }}
                    >
                      <Flag country={country} size="xl" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* 오른쪽 사이드 */}
              <div className="absolute top-0 right-4 md:right-8 lg:right-12 h-full w-24 md:w-32">
                <motion.div
                  className="flex flex-col gap-12 items-center"
                  animate={{
                    y: [-2000, 0],
                  }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {/* 국기들을 두 번 반복하여 무한 스크롤 효과 */}
                  {[...countries, ...countries].map((country, index) => (
                    <motion.div
                      key={`right-${country.id}-${index}`}
                      className="flex-shrink-0"
                      whileHover={{ scale: 1.2 }}
                    >
                      <Flag country={country} size="xl" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-7xl mx-auto relative z-10"
            >
              {/* Hero 섹션 */}
              <section className="p-4 md:p-8 pt-8 md:pt-12 pb-12 md:pb-16">
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
                    2026 북중미 월드컵 경기장 & 데이터 플랫폼
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 mb-8">
                    경기장, 국가, 선수 정보를 지도와 3D 모델로 한눈에
                    확인하세요.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("groups");
                        setTimeout(() => {
                          const element =
                            document.getElementById("match-schedule");
                          if (element) {
                            element.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          } else {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }, 100);
                      }}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      경기 일정
                    </Link>
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("stadiums");
                        setTimeout(() => {
                          const element =
                            document.getElementById("stadium-map");
                          if (element) {
                            element.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }, 100);
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      경기장 지도 보기
                    </Link>
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("pots");
                        setTimeout(() => {
                          const element =
                            document.getElementById("pots-content");
                          if (element) {
                            element.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          } else {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }, 100);
                      }}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      참가 국가
                    </Link>
                  </div>
                </div>
              </section>

              {/* 월드컵 상태 요약 섹션 */}
              <section className="px-4 md:px-8 mb-12 md:mb-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h3 className="text-sm text-gray-600 mb-2">개최국</h3>
                    <p className="text-base font-semibold text-gray-800">
                      미국 · 캐나다 · 멕시코
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h3 className="text-sm text-gray-600 mb-2">경기장 수</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {stadiums.length}+
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h3 className="text-sm text-gray-600 mb-2">참가국</h3>
                    <p className="text-2xl font-bold text-gray-800">48개국</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h3 className="text-sm text-gray-600 mb-2">대회 시작</h3>
                    <p className="text-base font-semibold text-gray-800">
                      2026년 6월
                    </p>
                  </div>
                </div>
              </section>

              {/* 주요 경기장 하이라이트 */}
              <section className="px-4 md:px-8 mb-12 md:mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                  주요 경기장
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stadiums
                    .filter((s) => s.sketchfabModelId)
                    .slice(0, 3)
                    .map((stadium) => (
                      <button
                        key={stadium.id}
                        onClick={() => setSelectedStadium(stadium.id)}
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 text-left w-full"
                      >
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {stadium.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {stadium.city}, {stadium.country}
                        </p>
                        <p className="text-gray-500 text-xs">
                          수용 인원: {stadium.capacity.toLocaleString()}명
                        </p>
                      </button>
                    ))}
                </div>
              </section>

              {/* 기존 탭 네비게이션 및 콘텐츠 */}
              <section
                className="p-4 md:p-8"
                style={{ position: "relative", zIndex: 1 }}
              >
                {/* 헤더: 제목 */}
                <div className="flex justify-center items-center mb-6 md:mb-8">
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
                    2026 북중미 월드컵
                  </h1>
                </div>

                {/* 탭 네비게이션 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
                </motion.div>

                {/* 탭별 컨텐츠 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="mt-6"
                >
                  {activeTab === "pots" ? (
                    <PotsTab />
                  ) : activeTab === "groups" ? (
                    <GroupsTab />
                  ) : activeTab === "stadiums" ? (
                    <StadiumsTab />
                  ) : (
                    <FifaRankingsTab />
                  )}
                </motion.div>
              </section>

              {/* 경기장 모달 */}
              <StadiumModal
                stadiumId={selectedStadium}
                onClose={() => setSelectedStadium(null)}
              />

              {/* Footer */}
              <footer className="px-4 md:px-8 py-8 mt-16 border-t border-gray-200">
                <div className="text-center text-gray-600 text-sm">
                  <p className="mb-2">2026 World Cup Data Project</p>
                  <p>Built with Next.js & Sketchfab</p>
                </div>
              </footer>
            </motion.div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
