/**
 * 국가 상세 / 스쿼드 페이지
 *
 * 경로: /teams/:id
 *
 * 책임 분리:
 * - 국가 메타 정보: /api/worldcup/standings
 * - 선수단 정보: /api/worldcup/teams/:id/players (유일한 선수 데이터 소스)
 *
 * 규칙:
 * - team.id === null인 경우 접근 불가 (플레이오프 국가)
 * - 선수 렌더링은 players API 결과만 사용
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import ImageSquadBuilder, { Formation } from "@/components/squad/ImageSquadBuilder";
import { fetchStandings, fetchPlayersByTeamId, isPlayoffTeam } from "@/src/utils/api";
import type { TeamStanding, PlayersResponse } from "@/src/types/api";
import { normalizeText } from "@/src/utils/normalizeText";

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.id ? Number(params.id) : null;

  const [teamStanding, setTeamStanding] = useState<TeamStanding | null>(null);
  const [players, setPlayers] = useState<PlayersResponse | null>(null);
  const [formation, setFormation] = useState<Formation>("4-3-3");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 플레이오프 국가 체크 및 데이터 로드
  useEffect(() => {
    async function loadTeamData() {
      if (!teamId || isPlayoffTeam(teamId)) {
        setError("플레이오프 국가는 접근할 수 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. 국가 메타 정보 로드 (standings API)
        const standingsData = await fetchStandings();
        const standing = standingsData.standings.find(
          (s) => s.team.id === teamId
        );

        if (!standing) {
          setError("국가를 찾을 수 없습니다.");
          setLoading(false);
          return;
        }

        setTeamStanding(standing);

        // 2. 선수단 정보 로드 (players API - 유일한 선수 데이터 소스)
        const playersData = await fetchPlayersByTeamId(teamId);
        setPlayers(playersData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "데이터를 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTeamData();
  }, [teamId]);

  const handlePlayerClick = useCallback((player: any, index: number) => {
    // 선수 상세 정보 표시 로직 (필요시 구현)
    console.log("Player clicked:", player);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!teamStanding || !players) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/")}
            className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← 뒤로가기
          </button>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={teamStanding.crest}
              alt={teamStanding.team.name}
              className="w-16 h-16 object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {teamStanding.team.name}
              </h1>
              <p className="text-gray-600">
                {teamStanding.group}조 · {teamStanding.position}위
              </p>
            </div>
          </div>
        </div>

        {/* 포메이션 선택 */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 mr-4">
            포메이션:
          </label>
          <select
            value={formation}
            onChange={(e) => setFormation(e.target.value as Formation)}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
          >
            <option value="4-3-3">4-3-3</option>
            <option value="4-4-2">4-4-2</option>
          </select>
        </div>

        {/* 스쿼드 빌더 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">스쿼드</h2>
          {players.players.length > 0 ? (
            <ImageSquadBuilder
              players={players.players.map((p) => ({
                id: p.id,
                name: p.name,
                position: p.position,
                imageUrl: `https://i.ifh.cc/qbhPHD.png`, // 이미지 URL은 실제 API 응답에 따라 조정
              }))}
              formation={formation}
              onPlayerClick={handlePlayerClick}
            />
          ) : (
            <p className="text-gray-600">선수 정보가 없습니다.</p>
          )}
        </div>

        {/* 선수 명단 */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">선수 명단</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.players.map((player) => (
              <div
                key={player.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-800">{player.name}</h3>
                {player.nameEn && (
                  <p className="text-sm text-gray-600">{player.nameEn}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {player.position}
                  {player.age && ` · ${player.age}세`}
                  {player.club && ` · ${player.club}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
