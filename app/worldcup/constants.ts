/**
 * WorldCup 페이지 탭 관련 상수 및 타입 정의
 *
 * 단일 소스 원칙(Single Source of Truth):
 * - TABS 배열을 as const로 정의하여 literal type 보장
 * - WorldCupTab 타입을 TABS 배열로부터 자동 추출
 * - 탭 추가/수정 시 이 파일만 수정하면 타입이 자동으로 동기화됨
 */

// 탭 배열을 단일 소스로 관리 (as const로 literal type 보장)
export const TABS = [
  { id: "groups", label: "경기 일정" },
  { id: "stadiums", label: "경기장" },
] as const;

// 탭 ID의 union type 추출 및 export
// TABS 배열에서 id 값만 추출하여 "groups" | "stadiums" 타입 생성
export type WorldCupTab = (typeof TABS)[number]["id"];
