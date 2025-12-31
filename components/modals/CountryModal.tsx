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

import { useState, useEffect, useMemo, useCallback } from "react";
import { Country, getCountryById } from "@/data/countries";
import { getPlayersByCountry, Player } from "@/data/players";
import { getFifaRanking, getFifaRank } from "@/data/fifaRankings";
import PlayerModal from "./PlayerModal";
import Flag from "@/components/ui/Flag";
import ModalHeader from "./ModalHeader";
import PlayerList from "@/components/cards/PlayerList";
import SquadBuilder, { Formation } from "@/components/squad/SquadBuilder";

interface CountryModalProps {
  countryId: string | null;
  onClose: () => void;
}

export default function CountryModal({ countryId, onClose }: CountryModalProps) {
  // 국가 ID로 국가 정보 조회
  const country = useMemo(() => countryId ? getCountryById(countryId) : null, [countryId]);

  // 국가 ID로 선수 목록 조회
  const players = useMemo(() => countryId ? getPlayersByCountry(countryId) : [], [countryId]);

  // 선택된 선수 (선수 모달 표시용)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // 스쿼드 빌더 관련 상태
  const [activeTab, setActiveTab] = useState<"players" | "squad">("players");
  const [formation, setFormation] = useState<Formation>("4-3-3");

  // CountryModal이 닫힐 때 PlayerModal도 함께 닫기
  useEffect(() => {
    if (!countryId) {
      setSelectedPlayer(null);
    }
  }, [countryId]);

  // 선수 모달 닫기 핸들러
  const handleClosePlayerModal = useCallback(() => {
    setSelectedPlayer(null);
  }, []);

  /**
   * ESC 키로 모달 닫기
   * PlayerModal이 열려있으면 먼저 PlayerModal을 닫고, 그 다음 CountryModal을 닫음
   */
  useEffect(() => {
    if (!countryId) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // PlayerModal이 열려있으면 먼저 PlayerModal 닫기
        if (selectedPlayer) {
          e.preventDefault();
          e.stopPropagation();
          setSelectedPlayer(null);
        } else {
          // PlayerModal이 없으면 CountryModal 닫기
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleEscape, true);
    return () => {
      window.removeEventListener("keydown", handleEscape, true);
    };
  }, [countryId, onClose, selectedPlayer]);

  /**
   * 모달 열림/닫힘 시 배경 스크롤 제어
   * - 모달이 열리면 배경 스크롤만 잠금 (배경은 보이도록 유지)
   * - 모달이 닫히면 스크롤 복원
   * - wheel/touchmove 이벤트로 배경 스크롤만 차단
   */
  useEffect(() => {
    if (countryId) {
      /**
       * 배경 스크롤 완전 차단 함수
       * 모달 내부(.modal-content)가 아닌 영역의 스크롤을 완전히 차단
       */
      const preventScroll = (e: WheelEvent | TouchEvent) => {
        // e.target이 Element인지 확인
        if (!(e.target instanceof Element)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        const target = e.target as HTMLElement;
        const modalContent = target.closest('.modal-content');

        // 모달 내부가 아닌 경우 무조건 스크롤 차단
        if (!modalContent) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };

      // 전역 스크롤 이벤트 리스너 추가 (여러 이벤트 타입)
      window.addEventListener('wheel', preventScroll, { passive: false, capture: true });
      window.addEventListener('touchmove', preventScroll, { passive: false, capture: true });
      document.addEventListener('wheel', preventScroll, { passive: false, capture: true });
      document.addEventListener('touchmove', preventScroll, { passive: false, capture: true });

      // cleanup: 모달 닫힐 때 이벤트 리스너 제거
      return () => {
        window.removeEventListener('wheel', preventScroll, true);
        window.removeEventListener('touchmove', preventScroll, true);
        document.removeEventListener('wheel', preventScroll, true);
        document.removeEventListener('touchmove', preventScroll, true);
      };
    }
  }, [countryId]);

  // FIFA 랭킹 정보 메모이제이션 (hooks는 항상 같은 순서로 호출되어야 함)
  const fifaRanking = useMemo(() => country ? getFifaRanking(country.id) : null, [country]);
  const fifaRank = useMemo(() => country ? getFifaRank(country.id) : null, [country]);

  // 선수 클릭 핸들러 메모이제이션 (hooks는 early return 이전에 호출되어야 함)
  const handlePlayerClick = useCallback((player: Player, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlayer(player);
  }, []);

  // 배경 클릭 핸들러 메모이제이션 (hooks는 early return 이전에 호출되어야 함)
  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // PlayerModal이 열려있으면 먼저 닫기
      if (selectedPlayer) {
        setSelectedPlayer(null);
      } else {
        onClose();
      }
    }
  }, [onClose, selectedPlayer]);

  // 국가 정보가 없으면 모달 표시 안 함 (모든 hooks 호출 후 early return)
  if (!country) return null;

  return (
    <>
      {/* 선수 상세 정보 모달 */}
      <PlayerModal
        player={selectedPlayer}
        countryName={country?.name}
        onClose={handleClosePlayerModal}
      />

      <div
        className="fixed inset-0 z-40 flex items-center justify-center p-4"
        style={{
          touchAction: 'none',
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          pointerEvents: 'auto',
        }}
        onClick={handleBackdropClick}
      >
        {/* 모달 컨테이너 */}
        <div className="modal-content bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 41 }}>
          <div className="p-6">
            {/* 헤더: 국가 정보 및 닫기 버튼 */}
            <ModalHeader
              title={country.name}
              subtitle={country.code}
              onClose={onClose}
            >
              <div className="flex flex-col items-center">
                <Flag country={country} size="xl" />
                {fifaRanking && fifaRank && (
                  <p className="text-sm text-blue-600 font-semibold mt-1">
                    FIFA 랭킹: {fifaRank}위 ({fifaRanking}점)
                  </p>
                )}
              </div>
            </ModalHeader>

            {/* 탭 네비게이션 */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("players")}
                className={`px-4 py-2 font-semibold transition-colors ${
                  activeTab === "players"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                선수 명단
              </button>
              <button
                onClick={() => setActiveTab("squad")}
                className={`px-4 py-2 font-semibold transition-colors ${
                  activeTab === "squad"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                스쿼드 빌더
              </button>
            </div>

            {/* 본문: 탭별 콘텐츠 */}
            <div className="min-h-[400px]">
              {activeTab === "players" && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">선수 명단</h3>
                  <PlayerList
                    players={players}
                    onPlayerClick={handlePlayerClick}
                  />
                </div>
              )}

              {activeTab === "squad" && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">스쿼드 빌더</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* 왼쪽: 주전 스쿼드 */}
                    <div className="flex-shrink-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-lg font-semibold text-gray-700">주전 스쿼드</h4>
                        <select
                          value={formation}
                          onChange={(e) => {
                            setFormation(e.target.value as Formation);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm"
                        >
                          <option value="4-3-3">4-3-3</option>
                          <option value="4-4-2">4-4-2</option>
                        </select>
                      </div>
                      <SquadBuilder
                        players={players}
                        formation={formation}
                        onPlayerClick={(player, position, e) => {
                          if (player && e) {
                            handlePlayerClick(player, e);
                          }
                        }}
                      />
                    </div>

                    {/* 오른쪽: 후보 명단 */}
                    <div className="flex-shrink-0">
                      <h4 className="text-lg font-semibold mb-3 text-gray-700">후보 명단</h4>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                        <PlayerList
                          players={players}
                          onPlayerClick={handlePlayerClick}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
