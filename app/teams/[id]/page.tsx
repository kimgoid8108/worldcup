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
import type { TeamStanding, FrontPlayersResponse, FrontPlayer } from "@/src/types/api";
import { normalizeText } from "@/src/utils/normalizeText";
import Flag from "@/components/ui/Flag";
import { getCountryByTeamName } from "@/data/countries";

// Flag 컴포넌트가 요구하는 필수 필드 검증 타입 가드
function isValidFlagCountry(
  country: { nameEn?: string; nameKo?: string; flagEmoji?: string; flagImageUrl?: string; code?: string } | undefined
): country is { nameKo: string; nameEn: string; flagEmoji: string; flagImageUrl?: string; code?: string } {
  return !!(country && country.nameKo && country.nameEn && country.flagEmoji);
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();

  // teamId 파싱 및 유효성 검사
  const teamIdParam = params?.id;
  const teamId = teamIdParam && !isNaN(Number(teamIdParam))
    ? Number(teamIdParam)
    : null;

  console.log("[컴포넌트 마운트] TeamDetailPage 렌더링", {
    params,
    teamIdParam,
    teamId,
    paramsType: typeof params?.id,
  });

  const [teamStanding, setTeamStanding] = useState<TeamStanding | null>(null);
  const [players, setPlayers] = useState<FrontPlayersResponse | null>(null);
  const [playersList, setPlayersList] = useState<FrontPlayer[]>([]);
  const [formation, setFormation] = useState<Formation>("4-3-3");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 플레이오프 국가 체크 및 데이터 로드
  useEffect(() => {
    console.log("[useEffect 트리거] 의존성 변경", { teamId, teamIdParam });

    async function loadTeamData() {
      console.log("[데이터 로드 시작] loadTeamData 함수 실행", { teamIdParam, teamId });

      // 1. teamId가 undefined이거나 유효하지 않은 경우 - fetch 실행 차단
      if (!teamIdParam || teamId === null || isNaN(teamId)) {
        console.warn("[방어 로직] teamId가 유효하지 않음 - fetch 실행 차단", {
          teamIdParam,
          teamId,
          teamIdType: typeof teamId,
          isNaN: isNaN(Number(teamIdParam || "")),
        });
        setError("유효하지 않은 국가 ID입니다.");
        setLoading(false);
        return;
      }

      // 2. 플레이오프 국가 체크 (team.id === null) - fetch 실행 차단
      if (isPlayoffTeam(teamId)) {
        console.warn("[방어 로직] 플레이오프 국가 - players API 호출 차단", { teamId });
        setError("플레이오프 국가는 접근할 수 없습니다.");
        setLoading(false);
        return;
      }

      // 3. teamId가 유효한 경우에만 fetch 실행
      console.log("[State 변경] loading = true, error = null", { teamId });
      setLoading(true);
      setError(null);

      try {
        console.log("[API 호출 시작] standings API 호출", { teamId, timestamp: new Date().toISOString() });

        // 1. 국가 메타 정보 로드 (standings API)
        const standingsData = await fetchStandings();
        console.log("[API Response] standings API 응답 수신", {
          standingsCount: standingsData.standings?.length || 0,
          data: standingsData,
        });

        const standing = standingsData.standings.find(
          (s) => s.team.id === teamId
        );

        if (!standing) {
          console.error("[에러] 국가를 찾을 수 없음", {
            teamId,
            availableIds: standingsData.standings.map(s => s.team.id),
          });
          setError("국가를 찾을 수 없습니다.");
          setLoading(false);
          return;
        }

        console.log("[State 변경] setTeamStanding 호출", { standing });
        setTeamStanding(standing);
        console.log("[State] teamStanding 설정 완료", {
          teamId: standing.team.id,
          teamName: standing.team.name,
        });

        // 2. 선수단 정보 로드 (players API - 유일한 선수 데이터 소스)
        console.log("[API 호출 시작] players API 호출", {
          teamId,
          url: `[API 호출 로그에서 확인]`,
          timestamp: new Date().toISOString(),
        });
        const playersData = await fetchPlayersByTeamId(teamId);

        // 변환된 데이터는 이미 FrontPlayersResponse 타입
        console.log("[API Response] players API 응답 수신", {
          teamId: playersData.team.id,
          teamName: playersData.team.name,
          playersCount: playersData.players.length,
        });

        console.log("[State 변경] setPlayers, setPlayersList 호출", {
          playersResponse: playersData,
          playersList: playersData.players,
          playersCount: playersData.players.length,
        });
        setPlayers(playersData);
        setPlayersList(playersData.players);
        console.log("[State] players 설정 완료", {
          playersResponse: playersData,
          playersList: playersData.players,
          playersCount: playersData.players.length,
        });
      } catch (err) {
        console.error("[에러] 데이터 로드 실패", {
          error: err,
          errorMessage: err instanceof Error ? err.message : String(err),
          teamId,
          stack: err instanceof Error ? err.stack : undefined,
        });
        setError(
          err instanceof Error ? err.message : "데이터를 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        console.log("[State 변경] setLoading(false) 호출", { teamId });
        setLoading(false);
        console.log("[렌더링 시점] 로딩 완료", {
          loading: false,
          teamId,
          hasTeamStanding: !!teamStanding,
          hasPlayers: !!players,
          playersListLength: playersList.length,
        });
      }
    }

    // teamId가 유효한 경우에만 실행
    if (teamId !== null && !isNaN(teamId)) {
      loadTeamData();
    } else {
      console.warn("[useEffect] teamId가 유효하지 않아 loadTeamData 실행 안 함", { teamId, teamIdParam });
      setLoading(false);
    }
  }, [teamId, teamIdParam]);

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

  // 렌더링 시점 로그
  console.log("[렌더링 시점] 컴포넌트 렌더링", {
    loading,
    error,
    teamStanding: teamStanding ? "있음" : "없음",
    players: players ? "있음" : "없음",
    playersListLength: playersList.length,
  });

  // 안전한 렌더링: teamStanding이 없으면 표시하지 않음
  if (!teamStanding) {
    return null;
  }

  // playersList가 비어있어도 UI는 표시 (안전한 렌더링)
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
            {(() => {
              // team.name으로 직접 country 정보 조회 (data 파일의 countryNameMapping 사용)
              const country = getCountryByTeamName(teamStanding.team.name);
              // Flag 컴포넌트가 요구하는 필수 필드(nameKo, nameEn, flagEmoji)가 모두 있는지 확인
              if (isValidFlagCountry(country)) {
                return <Flag country={country} size="xl" />;
              }
              return (
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500">{teamStanding.team.name.substring(0, 3)}</span>
                </div>
              );
            })()}
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
          {playersList && playersList.length > 0 ? (
            <ImageSquadBuilder
              players={playersList.map((p) => ({
                id: p.id,
                name: p.name,
                position: p.position,
                imageUrl: `https://i.ifh.cc/qbhPHD.png`, // 이미지 URL은 실제 API 응답에 따라 조정
              }))}
              formation={formation}
              onPlayerClick={handlePlayerClick}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">선수 정보가 없습니다.</p>
              {players && (
                <p className="text-sm text-gray-500 mt-2">
                  API 응답은 수신되었으나 선수 데이터가 비어있습니다.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 선수 명단 */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            선수 명단 {playersList.length > 0 && `(${playersList.length}명)`}
          </h2>
          {playersList && playersList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playersList.map((player) => (
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
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">선수 명단이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
