/**
 * 문자열 정규화 유틸 함수
 *
 * 용도: 검색 시 문자열 비교의 정확도를 보장하기 위한 정규화
 * - 유니코드 정규화 (NFC) 적용
 * - 모든 whitespace 제거 (앞뒤 공백, 중간 공백, 특수 whitespace)
 * - 소문자 변환
 *
 * 문제 해결:
 * 1. 보이지 않는 공백 제거 (예: \u200B, \u00A0 등)
 * 2. 유니코드 정규화 불일치 해결 (NFC/NFD)
 * 3. 앞뒤 공백 및 특수 whitespace 제거
 */

/**
 * 문자열을 검색 비교용으로 정규화
 *
 * @param text - 정규화할 문자열
 * @returns 정규화된 문자열 (NFC, 소문자, 모든 whitespace 제거)
 *
 * @example
 * normalizeText("  아르헨티나  ") // "아르헨티나"
 * normalizeText("아르헨티나\u200B") // "아르헨티나" (보이지 않는 공백 제거)
 * normalizeText("아르헨티나\u00A0") // "아르헨티나" (non-breaking space 제거)
 */
export function normalizeText(text: string): string {
  if (!text) return "";

  // 1. 유니코드 정규화 (NFC) - 조합된 문자와 분해된 문자를 통일
  // 예: "é" (NFC)와 "e\u0301" (NFD)를 동일하게 처리
  let normalized = text.normalize("NFC");

  // 2. 모든 whitespace 제거
  // - 일반 공백 (\s)
  // - non-breaking space (\u00A0)
  // - zero-width space (\u200B)
  // - zero-width non-joiner (\u200C)
  // - zero-width joiner (\u200D)
  // - 기타 유니코드 whitespace 문자들
  normalized = normalized.replace(/[\s\u00A0\u200B-\u200D\uFEFF]/g, "");

  // 3. 소문자 변환
  normalized = normalized.toLowerCase();

  return normalized;
}
