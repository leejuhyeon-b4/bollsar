# 볼살씨 / bollsar

엘리자벳·킹키부츠 공연 일정과 관극 기록을 관리하는 정적 웹 앱입니다. 저장소 루트를 정적 서버로 제공하며, 배포 설정은 `vercel.json`에 있습니다.

| 경로 | 역할 |
| --- | --- |
| `index.html`, `schedule-app.js` | 스케줄 탭 진입점과 공통 동작 |
| `settlement.html`, `settlement-app.js`, `settlement-export.*` | 정산판·PNG와 공통 동작 |
| `data.js`, `production-loader.js`, `theme-registry.js`, `seat-lines.js` | 공통 데이터 접근·작품 로딩·테마 등록·좌석선 엔진 |
| `productions/<작품>/data/schedule.js` | 실제 공연 날짜·회차·캐스팅 데이터 |
| `productions/<작품>/data/seat-map.js` | 극장 좌석·열·통로 데이터 |
| `themes/<테마>/scheduletab/` | 스케줄 화면 코드 |
| `themes/<테마>/settlement/` | 정산판 화면 코드 |
| `themes/<테마>/assets/scheduletab/` | 스케줄 전용 이미지 |
| `themes/<테마>/assets/settlement/` | 정산판·PNG 전용 이미지와 크롭 설정 |
| `themes/<테마>/assets/shared/` | 두 탭이 함께 쓰는 자산 |
| `themes/<테마>/assets/boots/`, `assets/three/`, 글꼴 폴더 | 실사용 배우 사진·3D·글꼴과 라이선스 |
| `assets/common/` | 공통 아이콘과 브라우저 라이브러리 |
| `sources/` | 편집 원본, 원본 사진, 공연 데이터 출처 |
| `database/` | SQL 설정 원본과 읽기 전용 권한 점검 |
| `scripts/` | 수동 관리·확인 도구 |
| `tests/` | 자동 테스트와 테스트 픽스처 |
| `docs/product/`, `docs/design/`, `docs/handoff/` | 과거 기획·디자인·인수인계 자료 |

현재 화면의 기준은 실제 코드입니다. 과거 PRD·디자인 문서는 당시 결정의 기록으로 보존합니다. `AGENTS.md`와 `SECURITY.md`는 루트에 유지합니다.

스케줄 **화면** 폴더 이름은 `scheduletab`이며, 공연 **데이터**의 `schedule.js` 이름은 그대로입니다. 작품 ID와 사용자 기록 저장 키는 변경하지 않았습니다.

전체 로컬 자동 테스트:

```powershell
node --test tests/*.test.cjs
git diff --check
```

`tests/rls-cross-access.mjs --live`는 원격 테스트 계정을 만들고 삭제하는 별도 통합 점검입니다. 로컬 회귀 테스트에 포함하지 않습니다. `node scripts/check-kinky-db.cjs`는 원격 공개 카운터의 읽기 전용 확인이며 결과는 무시되는 `artifacts/`에 기록합니다.

최종 Blender 제작 원본은 `sources/kinky-boots-2025-2026-7th-lola/three/`에 하나만 보존합니다. 서비스의 `assets/three/lola.glb`에는 이후 웹 후처리가 적용되어 있으므로 원본을 출력한 파일로 곧바로 덮어쓰지 않습니다.

임시 파일·검수 렌더·로그는 `tmp/`, `output/`, `artifacts/`에 두고 Git에 등록하지 않습니다. 편집 원본과 필요한 출처는 `sources/`에 둡니다. 비밀키는 로컬 환경 설정으로 관리하며 공개 클라이언트 anon 키와 구분합니다.
