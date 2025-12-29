/**
 * CountryModal 컴포넌트
 *
 * 용도: 국가 상세 정보를 표시하는 모달 컴포넌트
 * - 국가 이름, 국기, 코드 표시
 * - 해당 국가의 선수 명단 표시
 * - 국가 수도 위치를 Google Maps로 표시
 * - 모달 열림 시 배경 스크롤 잠금
 */

"use client";

import { useEffect } from "react";
import { Country, getCountryById } from "@/data/countries";
import { getPlayersByCountry } from "@/data/players";

interface CountryModalProps {
  countryId: string | null;
  onClose: () => void;
}

export default function CountryModal({ countryId, onClose }: CountryModalProps) {
  // 국가 ID로 국가 정보 조회
  const country = countryId ? getCountryById(countryId) : null;

  // 국가 ID로 선수 목록 조회
  const players = countryId ? getPlayersByCountry(countryId) : [];

  /**
   * 모달 열림/닫힘 시 배경 스크롤 제어
   * - 모달이 열리면 배경 스크롤 잠금
   * - 모달이 닫히면 스크롤 위치 복원
   */
  useEffect(() => {
    if (countryId) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;

      // 배경 스크롤 잠금 (body 고정)
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // 모달이 닫힌 경우 스크롤 복원
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    // cleanup: 모달 닫힐 때 스크롤 복원
    return () => {
      if (countryId) {
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || "0") * -1);
        }
      }
    };
  }, [countryId]);

  // 국가 정보가 없으면 모달 표시 안 함
  if (!country) return null;

  // Google Maps 임베드 URL 생성 (수도 좌표 사용, zoom=10으로 설정)
  const mapUrl = `https://www.google.com/maps?q=${country.latitude},${country.longitude}&output=embed&zoom=10`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={(e) => {
        // 배경 클릭 시 모달 닫기
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* 모달 컨테이너 */}
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 헤더: 국가 정보 및 닫기 버튼 */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <span className="text-6xl">{country.flag}</span>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{country.name}</h2>
                <p className="text-gray-600">{country.code}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-bold w-10 h-10 flex items-center justify-center"
              aria-label="모달 닫기"
            >
              ×
            </button>
          </div>

          {/* 본문: 선수 명단 및 국가 위치 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* 선수 명단 섹션 */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">선수 명단</h3>
              <div className="space-y-2">
                {players.length > 0 ? (
                  players.map((player) => (
                    <div
                      key={player.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">{player.name}</p>
                          <p className="text-sm text-gray-600">{player.position}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{player.club}</p>
                          <p className="text-xs text-gray-500">나이: {player.age}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">선수 정보가 없습니다.</p>
                )}
              </div>
            </div>

            {/* 국가 위치 섹션 (Google Maps) */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">국가 위치</h3>
              <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapUrl}
                  title={`${country.name} 위치 지도`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
