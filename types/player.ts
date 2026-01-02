/**
 * Player 관련 타입 정의
 *
 * 타입 계층 구조:
 * - PlayerBase: 모든 Player 타입의 공통 기반 (id: number로 통일)
 * - Player: 기본 선수 정보 (PlayerBase 확장)
 * - PlayerWithImage: 이미지 URL이 필수인 선수 정보 (PlayerBase 확장)
 *
 * 설계 원칙:
 * 1. 단일 소스 원칙: PlayerBase에서 공통 속성 정의
 * 2. id 타입 통일: 모든 Player 타입의 id는 number
 * 3. 확장 가능성: 추가 필드 추가 시에도 구조 유지
 * 4. 타입 안정성: union 타입 남용 방지, 타입 캐스팅 금지
 */

/**
 * 모든 Player 타입의 공통 기반 인터페이스
 * id는 반드시 number로 통일하여 타입 충돌 방지
 */
export interface PlayerBase {
  id: number; // 선수 고유 ID (number로 통일)
  name: string; // 선수 이름 (한글)
  position: string; // 포지션 (GK, DF, MF, FW)
}

/**
 * 기본 선수 정보 인터페이스
 * PlayerBase를 확장하여 추가 정보 포함
 */
export interface Player extends PlayerBase {
  nameEn?: string; // 선수 이름 (영어, 선택사항)
  age: number; // 나이
  club: string; // 소속 클럽
  imageUrl?: string; // 선수 이미지 URL (선택사항)
}

/**
 * 이미지 URL이 필수인 선수 정보 인터페이스
 * PlayerBase를 확장하여 imageUrl을 필수 필드로 정의
 * 스쿼드 빌더 등에서 이미지 표시가 필요한 경우 사용
 */
export interface PlayerWithImage extends PlayerBase {
  imageUrl: string; // 선수 이미지 URL (필수)
}
