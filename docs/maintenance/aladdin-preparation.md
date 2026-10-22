# 알라딘 초연 개발 준비

- 기준 릴리스: `kinky-boots-2025-2026-7th-lola-v1.0.4` / `8d43730`
- 개발 브랜치: `feat/aladdin-2024-2025-1st-genie`
- 작품 ID: `aladdin-2024-2025-1st` (향후 디자인 변경 시에도 기록 ID 유지)
- 테마 ID: `aladdin-2024-2025-1st-genie` / 표시 이름: **지니 · 알라딘 초연**
- 범위: 강홍석 지니, 서울 샤롯데씨어터(OP열 제외)·부산 드림씨어터
- 준비 진입점: `/aladdin/`, `/aladdin/settlement.html`

`main` 운영 배포는 변경하지 않습니다. 이 브랜치를 푸시하면 기존 Vercel 프로젝트의 Preview 배포가 생성됩니다. 이 브랜치의 `vercel.json`에서만 `/`를 `/aladdin/`으로 임시 이동합니다. 정식 통합할 때는 이 루트 이동을 제거하고 기존 홈 기본값을 유지해야 합니다.

공통 `data.js`, `schedule-app.js`, `settlement-app.js`, `seat-lines.js`를 재사용합니다. 서울·부산 스위치와 선택한 극장만 좌석도로 출력하는 PNG는 `themes/aladdin-2024-2025-1st-genie/settlement/view.js`에만 있습니다. 다른 테마에는 스위치가 없습니다.

| 위치 | 준비 내용 |
| --- | --- |
| `productions/aladdin-2024-2025-1st/data/` | 메타데이터·공식 좌석 데이터. 실제 일정·전체 캐스팅은 비어 있음 |
| `themes/aladdin-2024-2025-1st-genie/scheduletab/` | 공통 스케줄 렌더 계약을 갖춘 준비 상태 화면·추후 디자인 CSS |
| `themes/aladdin-2024-2025-1st-genie/settlement/` | 극장 전환·지역별 집계·임시 PNG·추후 디자인 CSS |
| `themes/aladdin-2024-2025-1st-genie/shared/` | 작품 디자인을 정하지 않은 중립적인 셸 |
| `themes/aladdin-2024-2025-1st-genie/assets/{scheduletab,settlement,shared}/` | 배포할 자산·출처·라이선스 위치 |
| `sources/aladdin-2024-2025-1st/` | 원본 자료·공식 출처 |

준비 페이지는 외부 통신·폼 제출을 CSP로 막고 Supabase 클라이언트를 생성하지 않습니다. 로그인·원격 저장·계정 삭제·분석 전송·PWA 설치를 연결하지 않았습니다. 기존 Vercel URL의 브라우저 저장소와도 출처가 다릅니다. 새 작품에 기존 엘리자벳의 작품 구분 없는 옛 기록을 복사하지 않습니다. DB 변경은 필요 없으며 원격 SQL도 실행하지 않습니다.

회차 원본을 받으면 서울·부산 공연을 같은 `PERFS`에 넣고 부산에 `venue:'부산 드림씨어터'`를 지정합니다. `WORK.venue`는 샤롯데로 유지합니다. 스케줄 사진·캐스팅·일정 렌더를 실제 디자인으로 교체하고 로그인·원격 저장·PWA는 별도 검증 후 연결합니다. 현 준비 상태에서 `WORK.preparing`만 끄면 완성되는 것은 아닙니다.

검증은 로컬 자동 테스트와 PC·모바일 브라우저에서 수행합니다. 실제 회차를 지어내거나 운영 기록으로 시험하지 않습니다. Vercel Preview 보호 설정이 켜져 있으면 Vercel 계정으로 접근해야 하며 프로젝트 전체 보호 설정을 변경하지 않습니다.

준비 검증 결과: 자동 테스트 57개 통과. PC 1440px·모바일 390px에서 스케줄·목록·테마 전환·서울/부산 마우스/터치 슬라이드·기존 기록 보존을 확인했습니다. 두 극장 모두 정산판 좌석 11×12px·SVG 0.5px, 확대 15×15px·SVG 1px, 실제 PNG 다운로드와 선택한 극장만 좌석도/다른 지역은 횟수만 표시하는 동작을 확인했습니다. 준비 페이지의 외부 요청·404·JavaScript 오류는 없었습니다. 실제 일정·캐스팅·공연별 좌석 판매 제외 여부·최종 디자인·로그인·PWA는 후속 작업입니다.
