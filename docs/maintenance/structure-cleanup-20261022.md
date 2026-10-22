# 파일·폴더 구조 정리 — 2026-10-22

기존 화면·기록·공연 데이터와 마지막 Blender 제작 원본을 보존하고 역할에 맞게 경로를 정리했습니다. 아래 구조 정리 검증에 이어 이미지 삭제와 릴리스 준비 회귀 검증을 진행했습니다.

```text
bollsar/
├─ index.html, settlement.html, 공통 JS, PWA 파일
├─ productions/<작품>/data/{schedule.js,seat-map.js}
├─ themes/<테마>/
│  ├─ scheduletab/             스케줄 화면 코드
│  ├─ settlement/              정산판 화면 코드
│  └─ assets/
│     ├─ scheduletab/          스케줄 전용 자산
│     ├─ settlement/           정산판·PNG 전용 자산
│     ├─ shared/               두 탭 공용 자산
│     ├─ boots/                실사용 배우 사진·크롭
│     └─ three/                배포 GLB·라이브러리·라이선스
├─ sources/                    편집 원본·사진 원본·출처
├─ database/                   SQL 원본·읽기 전용 권한 점검
├─ scripts/                    수동 확인 도구
├─ docs/{product,design,handoff,maintenance}/
└─ tests/                      자동 테스트·픽스처
```

`boots`, `three`, `shared`는 필요한 테마에만 존재합니다. 엘리자벳·킹키부츠의 공연 데이터 `productions/.../data/schedule.js`와 사용자 표시 스케줄 탭 이름은 변경하지 않았습니다.

| 항목 | 이번 작업 결과 |
| --- | --- |
| 파일 이동 | 최종 경로 유지 49개: 테마 14개, 원본·문서·SQL·도구 35개 |
| 현재 작업폴더 파일 삭제 | 72개, 24,585,368 bytes: 임시 산출물 70개 + 이미지 중복 1개 + 3D 대체 이미지 1개 |
| 깨진 이름의 캐시 폴더 | 루트 38개 제거, 하위 포함 빈 디렉터리 190개 |
| 형제 worktree | `bollsar-elisabeth-nov10`의 중복 추적 파일 117개와 Git 관리 포인터를 정상 제거 |

집계는 작업 시작 시 실제 존재한 파일 기준입니다. 이전 정리에서 이미 삭제되어 Git에 D로 보이던 부산물은 이번 삭제 수에 다시 포함하지 않았습니다. 이동은 파일별 최종 경로 기준이며 중간 이동을 중복 집계하지 않았습니다.

깨진 이름의 38개 트리는 `.thumbnails/fail/blender` 등을 포함한 **파일이 없는 캐시 디렉터리**였습니다. 원래 부모 이름은 복원할 수 없으나 파일 내용·추적 이력·참조가 없고 원래 이름을 포함한 복구 백업을 확보했습니다. 정상 한글 파일 96개는 Git의 octal 경로 표시와 구분하여 보존했습니다.

킹키부츠 `hero-boot-54d0.png`는 3D 로딩 실패 시 표시되던 대체 이미지였습니다. 사용 위치와 영향을 먼저 알린 뒤 이미지를 최종 삭제하고, `scheduletab/view.js`의 HTML과 `lola-viewer.js`의 동적 이미지 생성을 제거했습니다. 실패 시 같은 영역에 접근 가능한 안내 문구를 표시하고 회전 안내는 숨깁니다. 정상 3D 화면·배치는 유지하며 서비스 워커의 직접 이미지 참조는 없었습니다. `kinky-official-wordmark.png`는 실제 스케줄 워터마크라 `assets/scheduletab/`에 유지했습니다. 두 탭 공용 종이 배경의 PNG·SVG는 `assets/shared/`로 분리했습니다. 엘리자벳 달력 사진은 기존 배우 사진과 SHA256이 같아 `productions/elisabeth-2026-6th/cast/강홍석.jpg`를 재사용하고 테마 중복본을 제거했습니다.

최종 Blender 원본:

`sources/kinky-boots-2025-2026-7th-lola/three/lola-muscular-v2-macro-fiber-20261013.blend`

원본 SHA256 `5d908bac4c378d595d06d5e21b16270afbe1b588ff7136a4e30da2a4a24c0a09`와 배포 GLB SHA256 `5b74dfc9c3a8a68665b1fbd3d9e0a5c836152e8cc5f9145b4a63e2e3a18afe32`를 유지했습니다. 이동 후 Blender에서 다시 열어 네이티브 곡선과 외부 의존성 없음도 확인했습니다. 원본과 웹 후처리 GLB의 기존 차이는 유지합니다.

형제 worktree는 수정·미추적·무시 파일이 없는 detached 작업트리였습니다. 공연 121개와 `WORK/ACTORS/PERFS/RANGE`, 원본 일정 이미지가 현재 작업공간과 같았습니다. [YES24 공식 공지](https://m.ticket.yes24.com/Notice/Detail.aspx?bid=18655)에서 11월 10일 19:30 공연과 10월 14일 15:00 예매 오픈을 구분해 확인했고, 기존 회차·캐스팅·스탬프 안내가 이미 맞아 일정은 추가하지 않았습니다. 출처만 `sources/elisabeth-2026-6th/schedule/yes24day-20261110.md`에 보존했습니다.

Git 이력의 `dbf0b25`는 `origin/main`에서 도달 가능하고 현재 코드에도 해당 데이터가 보존되어 있습니다. 전체 worktree 백업 후 `git worktree remove`를 사용했으며 강제 폴더 삭제는 하지 않았습니다. `b4`의 다른 프로젝트 폴더는 변경하지 않았습니다.

복구 백업과 상세 이동 목록·검증 화면은 저장소 밖 다음 위치에 있습니다.

`C:/Users/User/AppData/Local/codex-with-chatgpt/backups/bollsar-structure-20261022/`

`workspace-before.tar.gz`는 작업 전 파일·빈 캐시 경로를, `elisabeth-worktree-before.tar.gz`는 형제 worktree 전체 파일을 보존합니다. 두 압축 파일의 모든 파일 내용을 개별 SHA256으로 검증했습니다. `evidence/all-moves.json`과 `evidence/stage-candidates.txt`는 전체 이동·선택적 staging 후보 목록입니다.

검증 결과:

- 전체 자동 테스트 43개와 `git diff --check` 통과.
- PC 1440px·모바일 390px, 두 작품의 스케줄·정산판 8개 화면에서 레이아웃·글꼴·색상 이전과 동일.
- 테마 전환·목록·상세·기록 유지·좌석 확대·공통 SVG 좌석선 확인.
- 두 작품·두 화면 폭에서 3172×1984 PNG를 실제 다운로드하고 사진·좌석선·배경을 시각 확인.
- 3D 키보드·마우스·모바일 터치 회전과 로딩 실패 대체 이미지 확인.
- PWA 설치 안내·로그인 창·service worker v88·이전 캐시 정리·무관한 캐시 보존 확인.
- 로컬 캐시 항목 168개를 확보한 뒤 PC·모바일에서 두 작품의 양 탭·기록·PNG·3D를 오프라인 확인.
- 로컬 자산 404와 브라우저 JavaScript 오류 없음. 중요 파일의 잘못된 ignore와 비밀키 패턴 발견 없음.

초기 로그인 창 확인은 샌드박스의 CDN 차단으로 실패했으나 허용된 브라우저 환경에서 재검증해 통과했습니다. 서비스 인증 코드는 변경하지 않았습니다.

최초 구조 정리 시 `AGENTS.md`를 제외한 142개 후보 경로가 staging dry-run을 통과했습니다. 이후 사용자가 요청한 대체 이미지 삭제를 반영했습니다. Git 기준 삭제·이동 수는 최종 staged diff로 따로 집계하며, 위 파일시스템 집계는 기존 미추적 파일 이동과 이전 정리 삭제를 포함해 Git 집계와 다릅니다.

경로 이동이 unstaged 상태에서는 D와 ??로 보이며 선택적으로 stage하면 이동으로 인식됩니다. 아래는 `AGENTS.md`를 제외한 경로가 명시된 staging 예시입니다.

```powershell
git add -A -- .gitignore README.md SECURITY.md production-loader.js theme-registry.js sw.js tests themes sources database docs scripts
git add -u -- output cast supabase-security.sql DESIGN2.md HONGCAL_HANDOFF.md HONGCAL_CHATGPT_PROJECT_INSTRUCTIONS_FULL.md PRD-1st.md PRD_v2.md PRD_v3.md
git diff --cached --stat
```

기존 사용자 수정인 `AGENTS.md`는 보존했으며 위 staging 예시에서 제외했습니다. `tmp/`, `output/`, `artifacts/`, 로컬 `.env*`, Blender 자동 백업을 무시하고 최종 `.blend` 등 중요 원본은 정상 등록 가능한지 확인했습니다. 릴리스 준비 시 경로 변경 관련 자동 테스트 28개가 통과했습니다. 이미지 삭제 회귀는 PC·모바일 정상 회전·WebGL 컨텍스트 손실·GLB 로딩 실패·재렌더 시 안내 문구를 확인했고 삭제 이미지 요청·404·JavaScript 오류는 없었습니다. v87의 이전 이미지 캐시 삭제·무관한 캐시와 저장 기록 보존·v88 오프라인 3D도 통과했습니다. 기존 전체 검증은 위 증거를 재사용합니다.

작업 시작 브랜치 `862cb2c` 대비 Git 이동 감지 기준 삭제 49개·이동 21개·신규 37개·수정 13개입니다. `main`의 기존 릴리스 `0ec1802`에는 부산물·미사용 이미지 48개 삭제가 이미 반영돼 있었습니다. 따라서 최종 main 커밋의 추가 변경은 삭제 2개·이동 20개·신규 38개·수정 13개이며, 기존 main에서 삭제됐던 마지막 Blender 원본을 새 `sources/` 경로에 바이트 동일하게 등록하는 것도 포함합니다. 앞서 사용자가 삭제한 이미지는 기존 main과 이번 커밋을 합친 최종 릴리스에 모두 반영됩니다. 라이선스 본문은 보존하고 새로 등록한 두 라이선스의 줄 끝 공백만 정리했습니다.

미확인 자료는 `sources/elisabeth-2026-6th/cast/cast-board-0904.jpg`의 촬영 연도·최초 제공 출처입니다. 참고 사진으로 보존하고 회차 수정 근거로 사용하지 않았습니다. 실제 휴대폰의 OS 설치와 원격 RLS 쓰기 통합 테스트는 수행하지 않았습니다.
