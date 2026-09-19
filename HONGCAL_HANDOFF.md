아래 전체를 새 프로젝트 **[개발] 볼살씨**의 첫 채팅에 그대로 붙여넣으면 돼.  
이번 정리는 대화 내용만이 아니라 **Codex with ChatGPT의 현재 `musicalender` workspace를 직접 확인해서 현재 파일 구조·Git 상태·실제 구현 코드와 대조한 상태**로 작성했어.

---

# [개발] 볼살씨 / `bollsar` 프로젝트 인수인계 문서

작성 기준일: **2026-09-19**

> **2026-09-19 리브랜딩 메모:** 사용자 표시명은 `볼살씨`, 코드/저장소 내부의 새 식별자는 `bollsar`로 정리한다. 단 GitHub repository, 로컬 상위 폴더, 현재 Codex workspace처럼 코드 패치 밖의 이름은 사용자가 별도로 rename하기 전까지 `musicalender`가 남을 수 있다. 과거 `홍캘`/`애배력`, `hongcal.*`/`aebaeryeok.*`는 역사 기록 또는 migration/cleanup 설명에서만 유지한다.

이 문서는 기존 `musicalender` 프로젝트 개발 대화를 새 ChatGPT 프로젝트로 이전하기 위한 전체 인수인계 문서다.  
새 채팅에서는 이 문서를 기본 컨텍스트로 사용하되, 작업을 시작할 때 반드시 **Codex with ChatGPT로 현재 workspace를 다시 확인한 뒤** 진행한다.

---

## 0. 현재 저장소 상태 — 가장 먼저 읽을 것

Codex with ChatGPT로 현재 실제 workspace를 확인한 결과:

```text id="037q1m"
workspace: musicalender
branch: main
commit: 9cf75bf
upstream: origin/main
ahead: 0
behind: 0
working tree: clean
staged: 없음
unstaged: 없음
untracked: 없음
conflict: 없음
```

즉, 현재 저장소는 **정리 및 CSP 수정까지 모두 커밋·푸시된 깨끗한 상태**다.

최근 중요한 Git 이력:

```text id="gxgk9b"
87b3811
organize assets and sources, verify closing performance
```

그 이후 CSP 문제를 수정하는 커밋이 추가됐고 현재 HEAD가 `9cf75bf`다.

안전 태그도 만들었다.

```text id="kqnkow"
elisabeth-2026-6th-lucheni-v1
elisabeth-2026-6th-lucheni-v1.1
```

의미:

- `v1`: 루케니 테마 첫 완성 안정본
- `v1.1`: 자산 구조 정리 + 막공 미검증 제거 + CSP 수정까지 반영된 안정본

**기존 태그를 움직이거나 덮어쓰지 않는다.** 앞으로 필요하면 새 태그를 추가한다.

현재 배포 주소:

```text id="lq79kt"
https://bollsar.vercel.app/
https://bollsar.vercel.app/settlement.html
```

---

# 1. 서비스의 현재 목적

현재 서비스 이름은 화면/PWA 기준 **볼살씨**다. 리브랜딩 전 서비스명 `홍캘`과 더 이전 PRD의 `애배력`은 역사 기록 또는 migration 설명에서만 남긴다.

현재 서비스의 실제 목적은:

> **강홍석 배우의 공연 스케줄을 달력/목록으로 확인하고, 사용자가 실제 관람한 회차와 좌석을 기록해 시즌별 정산판을 만드는 개인용·팬 배포용 PWA**

현재 대상 작품은:

```text id="cifx3h"
뮤지컬 엘리자벳
2026 6연
강홍석 — 루이지 루케니
블루스퀘어 우리은행홀
2026-08-16 ~ 2026-11-15
```

현재 사이트는 크게 두 기능으로 구성된다.

```text id="qbwu2c"
스케줄
└─ 달력형 / 목록형
   └─ 회차 상세
      └─ 로그인 시 관극 기록 + 좌석 기록

정산판
└─ 관람 횟수
└─ 좌석배치도
└─ 관극 기록
└─ 페어 조합 즐겨찾기
└─ PNG 이미지 저장
```

---

# 2. 앞으로의 방향 — 현재 가장 중요한 아키텍처 결정

현재 루케니 화면을 **당분간 그대로 유지한다.**

지금부터 진행할 리팩터링의 성공 기준은:

> **화면은 1픽셀도 바뀌지 않고, 뒤의 파일 구조만 바뀌어야 한다.**

하지만 미래 공연/시즌에서는 화면의 모든 비주얼 요소를 완전히 바꿀 수 있다.

사용자가 명확히 결정한 내용:

- 달력형 시스템은 유지
- 목록형 시스템은 유지
- 정산판 시스템은 유지
- 로그인/기록 시스템 유지
- 좌석 기록 시스템 유지
- 데이터 계산 방식 유지
- **색, 폰트, 배경, 사진, 타이포, 레이아웃, 카드, 버튼, 애니메이션 등 화면에 보이는 모든 것은 테마마다 완전히 달라질 수 있음**
- 현재 신문 디자인의 폰트도 앞으로 바뀔 수 있음
- 따라서 현재 폰트 역시 장기적으로는 `common`이 아니라 **루케니 테마 소유 자산**으로 봐야 함

향후 구조는 **시스템 / 공연 / 테마**를 분리하는 방향이다.

개념적으로:

```text id="hric2m"
core/
  공통 시스템 로직

productions/
  공연 자체 데이터

themes/
  공연/시즌별 비주얼과 화면 렌더링
```

예정 식별자:

```text id="ybls75"
production_id:
elisabeth-2026-6th

theme_id:
elisabeth-2026-6th-lucheni
```

현재 루케니 테마는 앞으로도 보존한다.

미래 시즌이 생기면 현재 시즌이 기본 테마가 되고, 예전 루케니 테마는 선택해서 다시 볼 수 있게 할 예정이다.

테마 선택 UI에 대한 과거 결정:

- 별도 테마 선택 랜딩페이지를 만들지 않는다.
- 현재 화면 그대로 진입한다.
- 마스트헤드 왼쪽의 비어 있는 영역에 테마 선택기를 배치할 계획.
- 오른쪽은 현재 로그인 버튼 유지.
- 예시:

```text id="e7xgaa"
루케니 6연 ▾                         로그인
```

메뉴 안에서는 전체 이름 표시:

```text id="yz6e5f"
엘리자벳 2026 6연 · 루케니
```

**아직 구현하지 않았다.**

---

# 3. 처음 기획 → 현재 기획 변화

## 3.1 PRD 초안 — 작품/다중 배우 서비스

`PRD-1st.md`

초기 기획은 훨씬 큰 플랫폼이었다.

주요 내용:

- 애배 최대 4명
- 여러 작품
- 홈
- 검색
- 내 달력
- 애배 달력
- 사용자 제보
- 캐스팅 변경 이력
- 작품/배우 검색
- KOPIS
- 관리자 입력
- 로그인
- DB

당시 탭:

```text id="6eni3x"
홈
검색하기
내 달력
애배 달력
```

기술 계획:

```text id="zkbmaj"
Next.js
TypeScript
Tailwind
Supabase
Vercel
```

---

## 3.2 PRD v2 — 배우 중심 플랫폼

`PRD_v2.md`

작품 중심 구조를 폐기하고 배우 중심으로 변경했다.

핵심은:

```text id="e71yax"
/[배우slug]
```

하나의 서비스가 배우마다 전용 앱처럼 보이는 구조였다.

관극 기록의 진짜 주인은 배우가 아니라:

```text id="670tym"
작품 + 회차 + 좌석
```

이라는 원칙을 세웠다.

여러 배우가 같은 회차에 출연하면 한 번 저장한 기록을 여러 배우 화면에서 공유하는 구조를 구상했다.

데이터 입력은:

```text id="6lmie6"
공식 이미지
→ Claude Vision
→ 구조화 데이터
→ 즉시 게시
→ 미검증
→ 유저 제보 수정
```

방식이었다.

---

## 3.3 PRD v3 — 강홍석 전용 PWA

`PRD_v3.md`

범위를 크게 줄였다.

문서 자체에:

> v2를 대체하고 강홍석 팬 대상 단일 웹앱으로 확정 축소

라고 적혀 있다.

탭도 2개로 정리했다.

```text id="tvo5jn"
배우 스케줄
정산판
```

별도 내 달력 없음.

관극 여부는 스케줄 상세에서 직접 기록.

목표:

```text id="q73nyx"
운영자 본인이 실제 사용
→ 팬덤 배포
```

---

## 3.4 현재 코드 — PRD v3보다 더 현실적으로 축소됨

현재 실제 코드는 PRD v3와도 다르다.

현재:

```text id="8zxnzv"
정적 HTML
Vanilla JavaScript
CSS
Supabase Auth/Postgres
Vercel
PWA
```

즉 현재는:

```text id="jjpq1i"
Next.js ❌
TypeScript ❌
Tailwind ❌
```

이다.

프레임워크 없이 정적 웹앱으로 만들어졌다.

이 변경은 초기 기획보다 빠르게 실사용 가능한 상태를 만드는 과정에서 자연스럽게 굳어진 결과다.

---

## 3.5 현재의 새로운 방향

PRD v3에서는 사실상 단일 강홍석 앱을 최종 형태로 봤다.

현재 방향은 그것보다 한 단계 확장됐다.

단:

**과거 v2처럼 여러 배우 플랫폼으로 돌아가는 것은 아니다.**

현재 구상:

> 강홍석 중심 서비스 시스템은 유지하되, 공연/시즌마다 완전히 다른 비주얼 테마를 적용할 수 있는 구조

즉:

```text id="42oiap"
시스템은 재사용
공연 데이터 분리
비주얼은 공연별 테마
```

가 목표다.

---

# 4. 현재 실제 프로젝트 구조

Codex workspace에서 확인한 현재 핵심 구조:

```text id="svhd2d"
musicalender/
│
├─ .claude/
│  └─ agents/
│     └─ reviewer.md
│
├─ .github/
│  └─ workflows/
│     └─ keep-alive.yml
│
├─ .serena/                    # 로컬 전용, gitignore
│
├─ assets/
│  ├─ common/
│  │  ├─ fonts.css
│  │  ├─ fonts/
│  │  ├─ gsap.min.js
│  │  ├─ html2canvas-1.4.1.min.js
│  │  ├─ apple-touch-icon.png
│  │  ├─ icon-192.png
│  │  └─ icon-512.png
│  │
│  └─ elisabeth-2026-6th-lucheni/
│     ├─ calendar-photo.jpg
│     ├─ lead-photo.jpg
│     └─ settlement-export-background.png
│
├─ cast/
│  ├─ 강홍석.jpg
│  ├─ 린아.jpg
│  ├─ ...
│  ├─ 황실세력가들2.jpg
│  └─ sample.jpg
│
├─ sources/
│  ├─ app-icon/
│  │  ├─ source.jpg
│  │  ├─ drawing-original.jpg
│  │  └─ drawing-cutout.png
│  │
│  ├─ elisabeth-2026-6th/
│  │  ├─ schedule/
│  │  │  ├─ original-01.jpg
│  │  │  ├─ original-02.jpg
│  │  │  ├─ original-03.jpg
│  │  │  └─ original-04.jpg
│  │  └─ seatmap-original.jpg
│  │
│  └─ elisabeth-2026-6th-lucheni/
│     └─ design/
│        ├─ newspaper-theme-original.jpg
│        └─ calendar-circle-photo-reference.jpg
│
├─ tests/
│  ├─ date-rollover.test.cjs
│  ├─ security.test.cjs
│  └─ rls-cross-access.mjs
│
├─ AGENTS.md
├─ data.js
├─ DESIGN2.md
├─ index.html
├─ manifest.json
├─ og-image.png
├─ PRD-1st.md
├─ PRD_v2.md
├─ PRD_v3.md
├─ pwa-install.js
├─ seat-lines.js
├─ SECURITY.md
├─ settlement-app.js
├─ settlement-export.html
├─ settlement-export.js
├─ settlement.html
├─ supabase-security.sql
├─ sw.js
└─ vercel.json
```

중요:

**현재 `ref/` 폴더는 없다.**

최근 작업에서 완전히 정리했다.

---

# 5. `assets/`와 `sources/`의 의미

이 구분은 앞으로도 유지한다.

## `assets/`

실제 웹앱이 실행 중 사용하는 파일.

예:

```text id="rskb74"
폰트
라이브러리
PWA 아이콘
실제 화면 사진
정산판 배경
```

## `sources/`

서비스가 런타임에 직접 쓰는 게 아니라 제작/검증의 원본이 되는 자료.

예:

```text id="haw8v4"
공식 캐스팅 스케줄 원본
좌석배치도 원본
디자인 참고 이미지
아이콘 제작 원본
```

중요:

**`sources/`의 파일을 Service Worker precache에 넣지 않는다.**

---

# 6. `ref/` 정리에서 이미 결정한 것

기존 `ref/`에는 런타임 자산, 원본 이미지, 오류 캡처, 폐기 디자인이 섞여 있었다.

최근 전부 분리했다.

### 삭제한 파일

오류 캡처:

```text id="4uk5iz"
a.png
b.png
error.png
```

폐기 디자인:

```text id="oawfoi"
kkkk.jpg
base.jpg
c.png
```

미사용:

```text id="kcvdtm"
c-hole-mask.png
orchestrated-easereverse.html
```

`c-hole-mask`를 사용하는 과거 송곳 구멍 효과는 폐기했다.

---

# 7. 현재 화면 구조

## 7.1 공통 마스트헤드

현재 스케줄/정산판 모두 같은 신문 디자인.

마스트헤드:

```text id="6h5n74"
Neue Zürcher Zeitung
강홍석
현재 날짜
```

오른쪽:

```text id="bcuwwr"
로그인
```

내비게이션:

```text id="62dbnm"
스케줄 | 정산판
```

현재 폭:

```text id="7svm0x"
max-width: 600px
```

모바일에서는 로그인 버튼 때문에 마스트헤드 상단 공간을 별도로 확보한다.

---

# 8. 스케줄 탭 — `index.html`

현재 스케줄 페이지는 실제로 다음 구조다.

```text id="zkjiui"
다가오는 회차 헤드라인
↓
달력 / 목록 전환
↓
월간 달력 또는 목록
↓
예매 링크
↓
강홍석 공식 링크
↓
제작사 링크
```

### 보기 전환

```text id="lwttvx"
달력
목록
```

상태:

```js id="n0yivj"
view = 'calendar' | 'list'
```

---

## 8.1 달력형

월요일 시작.

현재 데이터 범위:

```text id="vshoci"
2026년 8월 ~ 11월
```

즉:

```js id="rsl24e"
RANGE.min = 2026-08
RANGE.max = 2026-11
```

강홍석 출연 회차만:

```js id="6gc34s"
hongPerfs()
```

로 필터링한다.

달력 셀에는:

- 날짜
- 강홍석 사진
- 시간
- 이벤트
- 로그인 시 관람 여부 표시

가 들어간다.

모바일에서는 `커튼콜데이`를 짧게:

```text id="lpq3nv"
커튼콜
```

로 표시한다.

---

## 8.2 목록형

다가오는 회차와 지난 회차 분리.

기본:

```text id="v92l3k"
예정 회차
▼ 지난 회차 N건
```

과거 회차는 토글해서 펼친다.

---

## 8.3 회차 상세

달력/목록에서 회차 클릭 시 하단 시트.

내용:

```text id="1a1wxa"
날짜
시간
장소
D-day
회차 캐스팅
이벤트
캐스팅 변경 이력
관극 여부
좌석
```

같은 날 강홍석 회차가 여러 개면 상세 내부에서 시간 버튼으로 전환할 수 있다.

---

## 8.4 스케줄 로그인 경계

스케줄 자체 조회:

```text id="jj489l"
로그인 필요 없음
```

관극 기록/좌석:

```text id="9t8f5m"
로그인 필요
```

비로그인 상태에서도 상세는 볼 수 있지만:

```text id="aibvhu"
이 회차 담기
```

는 비활성화된다.

---

# 9. 현재 공연 데이터 — `data.js`

`data.js`는 현재 프로젝트의 가장 중요한 공용 파일이다.

현재 한 파일 안에 너무 많은 역할이 들어 있다.

```text id="y20p2l"
작품 데이터
배우 데이터
회차 데이터
좌석 데이터
시간 처리
Supabase Auth
관극 기록
localStorage
GA4 helper
좌석 helper
로그인 UI
```

향후 반드시 단계적으로 분리할 예정.

---

## 9.1 작품

```js id="obed7b"
WORK = {
  title: '엘리자벳',
  run: '6연',
  venue: '블루스퀘어 우리은행홀',
  period: {
    start: '2026-08-16',
    end: '2026-11-15'
  }
}
```

고정 배우:

```js id="1vdhpy"
HONG = 'hong'
```

---

## 9.2 주요 배역

현재 6배역:

```text id="v7aize"
엘리자벳
토드
루케니
요제프
소피
루돌프
```

캐스팅 풀:

- 엘리자벳 4
- 토드 4
- 루케니 3
- 요제프 2
- 소피 2
- 루돌프 2

---

## 9.3 회차 데이터

`PERFS`에 엘리자벳 전체 공연 회차가 들어 있다.

강홍석 회차만 넣은 것이 아니다.

화면이:

```js id="owhc2u"
hongPerfs()
```

로 필터링한다.

현재 데이터는:

```text id="d0acpm"
2026-08-16
~
2026-11-15
```

까지 들어 있다.

---

## 9.4 이벤트 데이터

현재 이벤트는 각 공연 객체에:

```js id="cmn5ii"
events: [
  {
    label: '...',
    verified: true|false
  }
]
```

형식으로 저장.

현재 중요한 확정 이벤트:

```text id="wd62jd"
9/9  커튼콜데이
9/12 커튼콜데이
9/13 커튼콜데이
11/14 14:00 강홍석 막공
```

최근 막공에서 `미검증`이 같이 붙던 문제를 수정했다.

현재:

```js id="nk9xs0"
events:[{ label:'막공', verified:true }]
```

이다.

`verified:false`면 UI가 자동으로:

```text id="bl8w5u"
· 미검증
```

을 붙인다.

---

# 10. 최근 추가한 엘리자벳 마지막 스케줄

최근 10/24~11/15 후속 캐스팅표를 반영했다.

강홍석 마지막 회차:

```text id="vuzz0d"
2026-11-14 14:00
```

이 회차에만:

```text id="98lbzq"
막공
```

표시.

11/15는 강홍석 출연 회차가 아니므로 스케줄 탭에는 표시되지 않는다.

---

# 11. 현재 코드와 데이터 주석의 불일치

`data.js` 상단 설명에는 아직:

```text id="238v43"
현재까지 공개된 마지막 회차 2026-10-23
막공일 미확인
```

같은 오래된 설명이 일부 남아 있다.

하지만 실제 `PERFS`는:

```text id="vxw1jk"
11/15까지
```

있고 강홍석 막공도:

```text id="7kb285"
11/14 14:00
verified:true
```

로 확정돼 있다.

즉:

### 현재 코드
최종 스케줄 있음.

### 과거 설명
10/23 이후 미확인.

### 이유
스케줄을 추가하면서 상단 문서 주석을 전부 업데이트하지 않았다.

향후 문서 정리 단계에서 수정해야 한다.

---

# 12. 현재 디자인 — 루케니 신문 테마

현재 스케줄/라이브 정산판은 **신문 지면 디자인**이다.

키워드:

```text id="gb4163"
Neue Zürcher Zeitung
유럽 신문
낡은 종이
구김
잉크 질감
편집 지면
```

현재 색:

```text id="yovc7l"
paper: #e9e3d5
ink: #17150f
accent: #8f2e22
```

종이 질감은 외부 이미지가 아니라 SVG turbulence로 생성한다.

---

# 13. 현재 폰트

현재:

```text id="dr4j9f"
UnifrakturMaguntia
Playfair Display
Hahmlet
IBM Plex Mono
Cafe24 Ssurround Air
```

역할:

```text id="pjz9ts"
제호:
UnifrakturMaguntia

영문 헤드라인:
Playfair Display

한글 헤드라인:
Hahmlet

본문:
Cafe24 Ssurround Air

숫자/라벨:
IBM Plex Mono
```

현재 위치:

```text id="e2hxb9"
assets/common/fonts.css
assets/common/fonts/*
```

하지만 **새로운 아키텍처 방향에서는 이 폰트들은 사실상 루케니 테마 전용이다.**

미래 테마는 폰트를 완전히 바꿀 수 있다.

따라서 다음 리팩터링 때:

```text id="eg0dq3"
themes/elisabeth-2026-6th-lucheni/fonts/
```

쪽으로 이동하는 것이 맞다.

반면 아래는 계속 공용 가능:

```text id="wbfy74"
GSAP
html2canvas
PWA app icon
```

---

# 14. 정산판 — 현재 구현

파일:

```text id="4n4fvq"
settlement.html
settlement-app.js
```

과거에는 JS가 HTML 안에 있었지만 CSP 문제 때문에:

```text id="4c7c36"
settlement-app.js
```

로 외부화했다.

이 구조는 유지한다.

---

## 14.1 로그인 게이트

비로그인 상태에서는 정산판 실내용이 흐리게 뒤에 보인다.

앞에:

```text id="m6e4sh"
로그인하면 내가 실제로 본 회차 기준으로
관람 횟수와 좌석 기록을 볼 수 있습니다
```

CTA 표시.

로그인하면 게이트 제거.

---

## 14.2 강홍석 고정

기본:

```js id="h3gj8f"
hongOnly = true
```

화면에:

```text id="g8g74t"
📌 강홍석
```

버튼.

한 번 누르면:

```text id="e2kb90"
전체 회차
```

기준으로 전환.

---

## 14.3 지난 회차만 정산

기본:

```js id="lkp8dp"
completedOnly = true
```

즉 공연 시작 시간이 지난 회차만 집계한다.

체크 해제하면 예정 회차도 포함.

공연 종료가 아니라:

> **공연 시작 시각이 되면 past**

로 처리한다.

시간 기준은 KST.

---

# 15. 날짜/시간 처리

`TODAY`는 브라우저 로컬 시간에 의존하지 않고:

```text id="983qp3"
Asia/Seoul
```

기준.

자정 이후 페이지를 계속 열어둬도 자동 갱신한다.

공연 시작 시각이 되면:

```text id="6m2gnj"
performancechange
```

이벤트를 발생시켜 정산판/스케줄 상태를 다시 렌더한다.

---

# 16. 관극 기록

기본 레코드:

```js id="vrdlnn"
{
  key: "2026|9|13|15:00",
  seat: "1-4-40"
}
```

`perf_key` 형식:

```text id="35t1im"
year|month|day|time
```

예:

```text id="xzqar9"
2026|11|14|14:00
```

---

# 17. 현재 기록 저장 구조

## Supabase

현재 서버 DB에 실제로 사용하는 핵심 테이블은:

```sql id="xiu0vv"
records
```

구조:

```text id="zu2o6a"
user_id
perf_key
seat
updated_at
```

PK:

```text id="tf78t5"
(user_id, perf_key)
```

---

## localStorage

관극 기록은 사용자 UUID별로 격리한다.

기본 prefix:

```text id="q3x8ix"
bollsar.records.v2
```

리브랜딩 이전 `aebaeryeok.records.v2`는 사용자 UUID/guest suffix가 같은 경우에만 새 prefix로 복사하는 migration 전용 legacy key다. 소유자를 알 수 없는 전역 legacy 기록은 계속 격리한다.

실제 형태:

```text id="9nuaax"
bollsar.records.v2.user.<SUPABASE_UUID>
```

게스트:

```text id="yd6ilc"
bollsar.records.v2.guest
```

예전 전역 캐시는 자동 병합하지 않는다.

이유:

> 다른 계정의 관극 기록이 섞이는 문제 방지

---

# 18. 앞으로 반드시 해결해야 하는 기록 구조 문제

현재 `records`에는:

```text id="x33y0z"
production_id
```

가 없다.

현재 한 작품뿐이라 문제없지만 미래 공연을 추가하면:

```text id="09cm6n"
2026|9|13|15:00
```

같은 `perf_key`가 다른 작품과 충돌할 수 있다.

**새 공연을 실제로 넣기 전에 반드시 production namespace를 추가해야 한다.**

예:

```text id="5oh3yt"
production_id = elisabeth-2026-6th
```

DB도 장기적으로:

```text id="ixou4m"
user_id
production_id
perf_key
seat
```

구조가 필요하다.

---

# 19. 방문 횟수별 좌석 색

현재 과거 PRD와 달라진 중요한 점.

과거 의도:

> 같은 색의 진하기로 1회/2회/3회/4회 구분

현재 실제 구현:

> **횟수마다 유저가 별도의 색을 직접 지정**

이유:

멀리 떨어진 좌석끼리는 색의 미세한 진하기를 비교하기 어렵기 때문.

색 8개:

```text id="fr46su"
rose
amber
gold
moss
teal
slate
indigo
plum
```

기본값은 전부 비어 있음.

사용자가:

```text id="ha6c7q"
1회 = 보라
2회 = 빨강
3회 = 노랑
4회+ = 초록
```

처럼 직접 설정.

데스크톱:

```text id="fn479d"
drag & drop
```

모바일:

```text id="qxtb20"
색 선택 → 횟수 칸 탭
```

둘 다 지원.

---

# 20. 색 설정 저장

localStorage:

```text id="eaggdd"
bollsar.visit-colors.v1.<user>
```

리브랜딩 이전 `hongcal.visit-colors.v1.<user>`는 같은 사용자 suffix에 한해서만 새 key로 복사하는 migration 전용 legacy key다.

현재 문제:

**production별로 분리되어 있지 않다.**

미래 공연 추가 전:

```text id="61xzow"
production_id
```

를 storage key에도 넣는 것이 좋다.

---

# 21. 페어 조합 즐겨찾기

현재 정산판에서 상대 배우 조합을 선택할 수 있다.

예:

```text id="t3da9j"
엘리자벳 = 린아
토드 = 김준수
요제프 = 민영기
...
```

모든 조합을 자동 생성하지 않는다.

사용자가 원하는 배역만 고정한다.

즐겨찾기:

```text id="rwxxh7"
최대 4개
```

현재 코드:

```js id="99t6d8"
FAVORITE_MAX = 4
```

과거 PRD v2에는 최대 3개라고 되어 있으므로 문서가 오래됐다.

현재가 정답이다.

저장:

```text id="0trg71"
bollsar.favorite-pairs.v1.<user>
```

리브랜딩 이전 `hongcal.favorite-pairs.v1.<user>`는 같은 사용자 suffix에 한해서만 새 key로 복사하는 migration 전용 legacy key다.

이 역시 미래에는 production별 namespace가 필요하다.

---

# 22. 좌석배치도 — 매우 중요

좌석 구현은 여러 번 시행착오를 겪고 안정화됐다.

**관련 없는 작업에서 절대로 `seat-lines.js`를 건드리지 않는다.**

---

## 22.1 좌석 데이터

현재:

```js id="in7u4i"
SEAT_MAP
```

에 블루스퀘어 우리은행홀 좌석을 구조화해 두었다.

좌석 원본:

```text id="ecgyh0"
sources/elisabeth-2026-6th/seatmap-original.jpg
```

좌석 id:

```text id="g65p34"
층-열-번호
```

예:

```text id="q5kij2"
1-4-40
```

---

## 22.2 1층

통로:

```text id="3ajsj1"
15
33
```

1~23열.

23열은 휠체어석:

```text id="41obgt"
D2~D9
D10~D17
```

특수 좌석.

---

## 22.3 2층

통로:

```text id="yez0h8"
15
31
```

뒤로 갈수록 중앙 블록이 안쪽으로 이동한다.

코드에서 `시작칸` 인수를 별도로 사용한다.

---

## 22.4 3층

통로:

```text id="chh0ms"
16
32
```

6열 중앙은:

```text id="fwarcw"
17~23
24~30
```

사이가 갈라져 있다.

그래서 중앙 블록에:

```text id="e642n1"
C
C2
```

두 조각이 있다.

---

# 23. 좌석 렌더링 원칙

현재 좌석의 테두리를 개별 CSS border로 그리지 않는다.

이전에:

```text id="4zlcu4"
좌석 경계가 두꺼워짐
공유선이 겹침
고DPI에서 선이 흔들림
끝 좌석 크기 보정
margin/translate 보정
```

같은 문제가 반복됐다.

최종 해결:

```text id="tkapez"
seat-lines.js
```

가 모든 좌석의 geometry를 읽고 **공유선을 한 번만 SVG로 그린다.**

핵심 원칙:

```text id="mlvo3k"
공유선 1번만
직각 연결
square linecap
miter join
```

현재 CSS 마지막에는 실제 seat border를:

```css id="khu447"
border:0 !important;
box-shadow:none !important;
```

로 없앤다.

---

# 24. 좌석 크기 규칙

AGENTS.md 기준:

정산판 기본:

```text id="254gmy"
11 × 12px
SVG 0.5px
```

현재 CSS에서도:

```text id="mjox27"
--seat: 11px
--seat-h: 12px
```

형태.

확대보기:

```text id="kn0zp8"
15 × 15px
SVG 1px
```

Export:

동일한 공유선 엔진 원칙.

---

# 25. 좌석배치도에서 절대 하지 말 것

절대 다시 하지 않는다.

```text id="41uqko"
개별 좌석 border로 모든 선 그리기
끝 좌석만 크기 줄이기
margin으로 좌석 밀기
translate로 픽셀 보정
특정 DPI에 맞춘 임시 px 조정
```

좌석 구조 문제는:

```text id="pl1xv6"
SEAT_MAP
floorGrid
seatRowCells
seat-lines.js
```

관점에서 해결한다.

---

# 26. 좌석 수정 후 반드시 검증할 화면

좌석 관련 수정은 반드시 모두 확인:

```text id="cnla7m"
정산판 기본
확대보기
PNG export
모바일
```

---

# 27. 확대보기

정산판의:

```text id="2y9inu"
확대해서 보기
```

버튼.

dialog 전체 화면 형태.

기본:

```text id="rck058"
100%
```

확대 범위:

```text id="by7s4d"
50% ~ 300%
```

25% 단위.

---

# 28. 정산판 PNG export

파일:

```text id="mgoace"
settlement-export.html
settlement-export.js
```

화면의 라이브 정산판을 그냥 캡처하지 않는다.

별도의 export 전용 레이아웃을 iframe으로 숨겨서 렌더링한다.

기본 캔버스:

```text id="s7n824"
1586 × 992
```

html2canvas:

```text id="gvxhbj"
scale: 2
```

최종 PNG:

```text id="075ax1"
3172 × 1984
```

---

# 29. Export 디자인

라이브 정산판은 신문 테마지만 Export 이미지는 현재 전혀 다른 디자인이다.

키워드:

```text id="ojn1bs"
엘리자벳 궁전
어두운 보라
금색
공식 캐스트 보드 느낌
```

배경:

```text id="32qegv"
assets/elisabeth-2026-6th-lucheni/
settlement-export-background.png
```

---

# 30. Export 배우 사진

`cast/`의 이미지 사용.

코드는:

```js id="wl867r"
img.src = 'cast/' + encodeURIComponent(item.file)
```

형태.

배우 사진은:

- 원본 크롭
- 스케일

만 한다.

`settlement-export.js` 최상단 규칙:

> No filters, retouching, or generated faces.

즉:

```text id="uq4xcc"
필터 ❌
얼굴 보정 ❌
생성 얼굴 ❌
```

원본 사진 crop만 허용.

---

# 31. `cast/` 상태

현재 파일은 총:

```text id="dqm7k5"
52개 실제 export용 이미지
+ sample.jpg
```

이다.

Export 코드에는 invariant:

```js id="8e1dcp"
if(allActors.length!==52 ||
   new Set(allActors.map(a=>a.file)).size!==52)
  throw Error('Cast inventory mismatch');
```

즉 정확히 52개의 실배우 이미지가 있어야 한다.

`sample.jpg`는 현재 코드에서 참조하지 않는다.

특수 파일명:

```text id="emkx0m"
황실세력가들2.jpg
```

공백 없는 이름이 의도된 것이다.

코드에서 해당 파일만 별도로 mapping한다.

---

# 32. 향후 cast 위치

현재:

```text id="qszgvq"
cast/
```

하지만 미래에는 같은 배우라도 공연 시즌별 공식 프로필 사진이 다를 수 있다.

따라서 cast 사진은 **theme이 아니라 production 소유**로 결정했다.

향후:

```text id="7ackuf"
productions/
└─ elisabeth-2026-6th/
   └─ cast/
```

로 이동할 계획.

---

# 33. Export의 주요 배우 배치

현재 주요 6개 배역:

```text id="z81xeb"
엘리자벳
죽음
루이지 루케니
프란츠 요제프
소피 대공비
루돌프
```

하단:

```text id="cuhaui"
막스 공작
루도비카·볼프 부인
엘리자벳의 측근들
황실 세력가들
어린 루돌프
앙상블
죽음의 천사들
```

하단 단역/앙상블의 개인 이름은 숨긴다.

과거 반복 수정 끝에:

```text id="smcd09"
소피
루돌프
페어 조합
```

배치도 안정화됐다.

페어 조합은 최대 4개.

---

# 34. 로그인/Auth

Supabase JS:

```text id="656jxu"
@supabase/supabase-js 2.116.0
```

CDN 로드.

SRI integrity 있음.

로그인 입력은 사용자에게 이메일을 받지 않는다.

아이디:

```text id="r91qxy"
abc123
```

를 내부적으로:

```text id="z7kmta"
abc123@bollsar.app
```

형태의 가상 이메일로 변환.

---

# 35. 자동 로그인

체크박스:

```text id="p7eab6"
이 기기에서 자동 로그인
```

켜면:

```text id="09min0"
localStorage
```

끄면:

```text id="zebyvg"
sessionStorage
```

사용. 자동 로그인 선택 상태 key는 이미 `bollsar.auth.remember`를 사용하고 있어 이번 리브랜딩에서 별도 migration이 필요하지 않다. Supabase 세션 저장 key도 브랜드 prefix가 아니라 Supabase client가 관리하므로 그대로 유지한다.

---

# 36. 현재 계정 관리 메뉴

현재 실제 코드가 정답이다.

로그인 후 로그인 버튼 클릭:

```text id="qh3lxi"
계정 관리
```

메뉴:

```text id="k6b4ru"
로그아웃
내 기록 내보내기
계정 삭제
```

이 세 개만 있다.

과거에는:

```text id="cajv3e"
비밀번호 변경
2단계 인증
```

도 구현했지만 사용자 요청으로 제거했다.

---

# 37. SECURITY.md와 현재 코드 불일치

`SECURITY.md`에는 아직:

```text id="2m7gmw"
로그인 중 비밀번호 변경
TOTP 2단계 인증
```

을 제공한다고 쓰여 있다.

하지만 현재 코드에는 없다.

### 현재 코드
로그아웃 / 기록 내보내기 / 계정 삭제.

### 과거 의도
비밀번호 변경 / TOTP까지 제공.

### 차이가 생긴 이유
계정 메뉴를 단순하게 유지하기로 결정하면서 두 기능을 제거함.

`SECURITY.md`를 나중에 갱신해야 한다.

---

# 38. 비밀번호 정책

앱:

```text id="pfvton"
최소 8자
영문 포함
숫자 포함
특수문자 포함
```

정규식으로 검사.

Supabase Dashboard에서도 최소 8자 설정 완료.

다만 Supabase 자체 설정에서 현재 원하는:

```text id="koh64b"
영문 + 숫자 + 특수문자
```

조합을 강제할 수 없어 앱만 검사한다.

따라서 공개 Auth API를 직접 호출하면 조합 규칙을 우회할 수 있는 잔여 위험이 있다.

---

# 39. 비밀번호 찾기

현재 제공하지 않는다.

이유:

사용자 계정은:

```text id="3a039e"
<id>@bollsar.app
```

이라는 내부 가상 이메일이므로 실제 메일을 받을 수 없다.

비밀번호 재설정을 만들려면:

```text id="gq2loi"
실제 이메일 수집/검증
```

또는 별도 복구 시스템이 먼저 필요하다.

---

# 40. Supabase 보안 상태

`supabase-security.sql`

현재 적용된 핵심:

```text id="0g5uw8"
records RLS
본인 레코드만 CRUD
delete_account RPC
```

2026-09-11에 실제 임시 계정 2개로:

```text id="dtbmd0"
cross select
cross insert
cross update
cross delete
```

모두 차단되는 것을 확인했다.

테스트 계정은 이후 삭제했다.

---

# 41. GA4

측정 ID:

```text id="07q0a3"
G-VVZ9RJGYT1
```

현재 `track()` wrapper는 개인정보/관극 데이터 유출을 막기 위해 allowlist 방식.

허용 파라미터만 GA로 보낸다.

예:

```text id="1e9745"
source
view
from
target
vendor
hong_only
level
color
has_seat
had_existing
```

다음처럼 관극 이력을 재구성할 수 있는 값은 보내지 않는다.

```text id="bplnxi"
perf key
seat
pair
```

---

# 42. 계정별 localStorage 격리

현재 다음도 사용자별 저장:

```text id="fedq0d"
관극 기록
방문 횟수별 색
페어 즐겨찾기
```

그러나:

```text id="6vucui"
visit colors
favorite pairs
```

는 `authUserId()` 기준이지 production 기준은 아니다.

미래 공연 추가 전 반드시 production namespace 검토.

---

# 43. PWA 현재 상태

`manifest.json`

현재:

```text id="yf4frf"
name: 볼살씨
short_name: 볼살씨
display: standalone
start_url: ./index.html
```

아이콘:

```text id="9xcr3f"
assets/common/icon-192.png
assets/common/icon-512.png
apple-touch-icon.png
```

---

# 44. Service Worker

`sw.js`

현재:

```js id="12u5ih"
CACHE_VERSION = 'v42'
```

prefix:

```text id="5hmm8h"
bollsar-
```

리브랜딩 이전 cleanup 전용 legacy prefix:

```text id="twalf2"
hongcal-
aebaeryeok-
```

legacy cache도 activate 때 정리.

전략:

페이지 navigation:

```text id="hjomzx"
network first
```

동일 origin 정적 파일:

```text id="p9iqhh"
cache first
```

offline navigation fallback:

```text id="d8d3il"
index.html
settlement.html
```

---

# 45. Service Worker 수정 규칙

자산 경로 변경/중요 정적 파일 변경 시:

```text id="123ck2"
CACHE_VERSION
```

을 올린다.

특히 파일을 이동하면서 APP_SHELL 경로도 반드시 수정한다.

현재 `sw.js`에는 새 `assets/` 경로가 반영된 상태.

---

# 46. PWA 설치 UI

`pwa-install.js`

지원:

```text id="y7znri"
beforeinstallprompt
Android/Chrome 설치
iOS Safari 홈 화면 추가 안내
수동 설치 안내
```

버튼:

```text id="hqwn3a"
이 디바이스에서 다시 보지 않기
```

localStorage:

```text id="ly3cxt"
bollsar.install.never.v1
```

리브랜딩 이전 `hongcal.install.never.v1` 값은 새 key가 비어 있을 때만 복사한다. standalone 세션 추적 key도 `bollsar.analytics.standalone-session.v1`을 사용하고, 같은 세션의 기존 `hongcal.analytics.standalone-session.v1` 값만 migration한다.

standalone launch도 추적.

---

# 47. Supabase keep-alive

`.github/workflows/keep-alive.yml`

Supabase 무료 프로젝트 inactivity 정지를 막기 위한 GitHub Action.

대략 5일마다 REST 요청.

필요 GitHub secrets:

```text id="rnpdfb"
SUPABASE_URL
SUPABASE_KEY
```

---

# 48. CSP — 매우 중요한 주의사항

현재 강한 Content Security Policy를 사용한다.

적용 장소:

```text id="rpledz"
index.html meta CSP
settlement.html meta CSP
vercel.json HTTP header CSP
```

최근 가장 큰 장애가 여기서 발생했다.

---

# 49. 최근 발생한 CSP 장애

자산 정리 과정에서:

```js id="cq5brq"
const PHOTO = 'ref/...'
```

를:

```js id="rzm0c2"
const PHOTO = 'assets/...'
```

로 바꿨다.

이 코드가 **index.html의 inline script 안**에 있었다.

inline script 내용이 1글자라도 바뀌면 SHA-256 hash가 바뀐다.

그런데 CSP hash는 기존 값 그대로여서 브라우저가 메인 JS를 차단했다.

증상:

```text id="qv85ur"
디자인은 정상
스케줄이 안 뜸
로그인 버튼 눌러도 아무 반응 없음
```

브라우저 콘솔:

```text id="nvs7ba"
Executing inline script violates Content Security Policy
```

원인이었다.

수정 후:

```text id="2f90jo"
CSP / JS 오류 없음
스케줄 렌더 정상
```

확인.

---

# 50. CSP 관련 절대 규칙

`index.html` 또는 `settlement.html`의 inline JS를 변경하면:

1. 새 SHA-256 hash 계산
2. HTML meta CSP 수정
3. `vercel.json` CSP 수정
4. 실제 브라우저 로드 검사
5. 그 후 커밋

해야 한다.

단순:

```text id="kva1iq"
node --check
```

만으로는 CSP 문제를 발견할 수 없다.

장기적으로는 `index.html`의 큰 inline app script도 외부 JS로 빼는 것이 좋다.

`settlement-app.js`는 이미 그렇게 분리했다.

---

# 51. 현재 테스트 구조

`tests/`

세 파일.

### `date-rollover.test.cjs`

테스트 내용:

- 한국 자정 날짜 변경
- 공연 시작 시각 past 전환
- inline script syntax
- CSP hash
- 정산판 동작 regex
- 스케줄 과거 회차
- 모바일 커튼콜 텍스트

### `security.test.cjs`

검사:

- 사용자별 localStorage key 분리
- legacy record 격리
- 비밀번호 규칙
- GA4 allowlist
- PWA analytics event 존재

### `rls-cross-access.mjs`

실제 Supabase live 테스트.

반드시:

```text id="qt95hq"
--live
```

를 넣어야 실행.

임시 사용자 A/B 생성 → RLS 검증 → 사용자 삭제.

---

# 52. 테스트 관련 현재 기술부채

중요.

`date-rollover.test.cjs` 일부는 과거 구조를 아직 가정한다.

예를 들어:

```text id="ox27c1"
settlement.html 안에
let completedOnly = true
```

등을 찾는다.

하지만 현재 해당 로직은:

```text id="e99sgg"
settlement-app.js
```

로 외부화되어 있다.

즉 이 테스트의 일부 regex는 현재 코드 구조와 맞지 않을 가능성이 매우 높다.

Codex workspace에는 최근 테스트 실행 기록이 없었다.

따라서:

> 테스트가 오래됐다고 해서 현재 코드를 테스트에 맞춰 되돌리지 말 것.

먼저 테스트가 현재 구조를 반영하도록 수정해야 한다.

---

# 53. reviewer agent

`.claude/agents/reviewer.md`

출시 전 QA 담당.

검사 내용:

```text id="ghfzl6"
좌석배치도
OG
깨진 링크
모바일
폰트
배포 URL
```

직접 수정하지 않고 보고만 하는 agent.

주의:

이 문서도 과거 좌석 방식 일부가 남아 있다.

예를 들어 box-shadow/가로스크롤 관련 설명 중 일부는 현재 `seat-lines.js` 구조와 맞지 않을 수 있다.

QA 문서 역시 리팩터링 후 업데이트 대상.

---

# 54. AGENTS.md — 반드시 지켜야 할 작업 규칙

현재 tracked `AGENTS.md`의 중요한 규칙.

## 일반 작업

- 쉬운 작업과 커밋/배포 준비는 가능하면 하위 모델/에이전트에 위임.
- 같은 해결법을 2번 실패하면 3번째부터 동일 접근 반복 금지.
- 실패 원인과 새로운 접근을 짧게 설명.
- 큰 파일 전체 읽기 금지.
- 검색 / symbol / 관련 line만 읽기.
- Serena, Ponytail, Codex with ChatGPT가 있으면 적극 활용.
- 사용하지 않은 도구를 사용했다고 말하지 않기.
- 패치 성공 != 문제 해결.
- 실제 화면/동작까지 확인.
- **`git add .` 금지.**

## 좌석

- 좌석 엔진은 작품 테마와 분리.
- 작품 변경 시 색/폰트/배경/장식/UI만 변경.
- 극장/공연 좌석 변경 시 데이터 교체.
- 개별 CSS border 금지.
- `seat-lines.js` 사용.
- 공유선 한 번만.
- 직각.
- 끝 좌석 크기 변경 금지.
- margin/translate/pixel 보정 금지.
- 좌석 수정 후 live/overview/PNG/mobile 확인.
- 좌석 문제 아니면 `seat-lines.js`와 export 구조 건드리지 않기.

---

# 55. 사용자가 선호하는 작업 방식

이 프로젝트에서 매우 중요.

사용자는:

> 빨리 많이 바꾸는 것보다 천천히 하나씩 안전하게 작업하는 것

을 선호한다.

기본 작업 흐름:

```text id="sfgd2n"
1. 현재 상태 확인
2. 무엇을 바꿀지 설명
3. 사용자 확인
4. 한 단계 실행
5. 결과 검증
6. 다음 단계
```

한꺼번에 대규모 리팩터링하지 않는다.

단 사용자가:

```text id="32tmlu"
한번에 줘
```

라고 명확히 요청하면 하나의 실행 블록으로 줄 수 있다.

---

# 56. PowerShell 작업 규칙

사용자는 Windows + PowerShell + VS Code.

중요:

한글 파일 인코딩 문제가 과거 발생했다.

**`Get-Content -Raw`로 읽어서 그대로 덮어쓰는 식의 패치는 피한다.**

권장:

```python id="3ny1ak"
Path.read_bytes()
.decode("utf-8")

Path.write_bytes(
    text.encode("utf-8")
)
```

또는 명시적 UTF-8 .NET write.

---

# 57. Git 작업 규칙

절대:

```text id="hn4xfc"
git add .
```

하지 않는다.

항상:

```text id="3qzcu2"
git add -- file1 file2 ...
```

식으로 명시한다.

또한 임의로:

```text id="u1qqo5"
git reset --hard
git clean -fd
```

하지 않는다.

예전에는 untracked/backup 파일이 많았기 때문에 특히 중요했다.

현재는 clean 상태지만 규칙 유지.

---

# 58. pager 피하기

과거 `git diff`가 pager로 열려 사용자 화면에:

```text id="v4l62b"
:
```

가 뜬 적이 있다.

사용자가 `q`로 종료했다.

가능하면:

```text id="cfhc6f"
git --no-pager diff
```

사용.

---

# 59. 스크린샷 관련 사용자 선호

사용자에게:

```text id="k3ntng"
화면 캡처해서 보내주세요
```

라고 요구하지 않는다.

사용자가 텍스트 결과를 주면 그것을 기반으로 진행.

필요하면 개발자가 자동으로:

```text id="42njah"
headless Chrome
local server
DOM
console log
```

을 검사하는 방식 선호.

---

# 60. 최근 저장소 대청소

예전 루트에 다음이 많이 있었다.

```text id="o2jkcz"
artifacts/
*.before-*
node_modules/
diagnose scripts
check scripts
test scripts
package.json
package-lock.json
desktop.ini
```

정리 완료.

특히:

```text id="fuasuk"
artifacts/
```

가 약 900MB 이상이었고 Git 추적 대상도 아니며 런타임 참조도 없어서 삭제.

`node_modules`, `package.json`, `package-lock.json`도 Puppeteer 진단용으로만 쓰던 시점이 끝나 삭제했다.

현재 package manager 없음.

---

# 61. 현재 `.gitignore`

대략:

```text id="lq94bp"
supabase/.temp/
ref/drawing.jpg
.serena/
node_modules/
artifacts/
*.before-*
_patch_*.py
```

주의:

```text id="h0pdo1"
ref/drawing.jpg
```

는 `ref/` 자체가 사라졌으므로 오래된 ignore rule이다.

나중에 정리 가능.

---

# 62. 현재 `supabase/` 디렉터리 상태

과거 대화에서는:

```text id="3fyr3q"
supabase/
```

폴더가 언급된 적이 있다.

하지만 **현재 Codex workspace tree에는 `supabase/` 디렉터리가 보이지 않는다.**

현재 Supabase 관련 tracked 파일은 루트:

```text id="13q7sw"
supabase-security.sql
```

이 핵심이다.

과거 구조를 그대로 있다고 가정하면 안 된다.

---

# 63. 데이터 입력 자동화 — 과거 의도와 현재

## 과거 PRD

계획:

```text id="hjf1ii"
캐스팅표
→ OCR / Vision
→ DB
```

v2:

```text id="ivslzf"
Claude Vision
```

v3:

```text id="j4u2ff"
Naver Clova OCR 우선
수동 입력 fallback
```

## 현재 코드

자동화 없음.

현재 공연 정보는:

```text id="x3io7p"
data.js
```

에 수동으로 정리한 정적 데이터.

현재 workspace에는:

```text id="bemojv"
관리자 화면 ❌
OCR 코드 ❌
KOPIS runtime 연결 ❌
Claude Vision pipeline ❌
```

이다.

---

# 64. KOPIS

KOPIS API 키 승인은 과거 받아둔 상태지만 현재 `bollsar` 런타임에서는 사용하지 않는다.

과거 판단:

KOPIS는 작품 일정/기초 정보에는 유용하지만:

```text id="gjn1gr"
회차별 캐스팅
```

을 제공하지 않아 핵심 문제를 해결하지 못한다.

따라서 지금 우선순위 아님.

---

# 65. 오프라인 스케줄

PRD v3에는:

```text id="ku7odo"
팬미팅
무대인사
행사
영화
```

같은 offline schedule도 같은 탭에 넣겠다는 계획이 있다.

현재 실제 구현:

```text id="24ytiw"
없음
```

향후 필요하면 다시 검토.

---

# 66. 제보 기능

초기 PRD에는 매우 중요했지만 현재:

```text id="yzgx3q"
유저 제보 시스템 없음
report_flags 없음
```

PRD v3에서 이미 보류 상태.

현재 서비스는 운영자가 공식 자료를 직접 반영하는 방식.

---

# 67. 디자인 문서 `DESIGN2.md`

`DESIGN2.md`는 과거 초기 디자인 시스템 문서다.

내용:

```text id="60r0rv"
연보라 배경
흰 카드
보라/주황/청록...
Gowun Batang 계열 디자인
```

현재 실제 UI인 **신문 테마와 다르다.**

즉:

### 과거 의도
차분한 연보라 카드 UI.

### 현재 코드
신문/신문지 디자인.

### 이유
후속 디자인 실험에서 신문 콘셉트를 채택하면서 실제 UI가 크게 변경됨.

`DESIGN2.md`를 현재 디자인 spec으로 간주하면 안 된다.

참고용 과거 문서다.

---

# 68. 루케니 디자인 원본

현재 보존 중:

```text id="2pvvdh"
sources/elisabeth-2026-6th-lucheni/design/
```

파일:

```text id="ayjvqh"
newspaper-theme-original.jpg
calendar-circle-photo-reference.jpg
```

이것들은 런타임이 아니라 디자인 원본/참고.

---

# 69. 앱 아이콘 원본

```text id="jz8ngx"
sources/app-icon/
```

현재:

```text id="5vex8q"
source.jpg
drawing-original.jpg
drawing-cutout.png
```

실제 PWA 아이콘은:

```text id="ydody1"
assets/common/icon-192.png
assets/common/icon-512.png
assets/common/apple-touch-icon.png
```

---

# 70. `og-image.png`

현재 루트:

```text id="v8uu4v"
og-image.png
```

두 페이지 OG에서:

```text id="538rxq"
https://bollsar.vercel.app/og-image.png
```

사용.

새 architecture에서는 테마 비주얼이므로 장기적으로:

```text id="u1ft6k"
themes/
└─ elisabeth-2026-6th-lucheni/
   └─ assets/
      └─ social/
         └─ og-image.png
```

쪽이 자연스럽다.

아직 이동하지 않았다.

---

# 71. 현재 루케니 runtime 이미지

현재 중간 위치:

```text id="37pzx1"
assets/elisabeth-2026-6th-lucheni/
```

세 파일:

```text id="5z8kk2"
calendar-photo.jpg
lead-photo.jpg
settlement-export-background.png
```

이 폴더는 **최종 구조가 아니라 다음 리팩터링을 위한 중간 정리 상태**다.

---

# 72. 다음 단계에서 만들 예정인 테마 구조

현재 결정된 방향:

```text id="lmygmq"
themes/
└─ elisabeth-2026-6th-lucheni/
   ├─ assets/
   │  ├─ schedule/
   │  │  ├─ calendar-photo.jpg
   │  │  └─ lead-photo.jpg
   │  │
   │  ├─ settlement/
   │  │  └─ settlement-export-background.png
   │  │
   │  └─ social/
   │     └─ og-image.png
   │
   ├─ fonts/
   │  ├─ fonts.css
   │  └─ *.woff2
   │
   ├─ schedule/
   │  ├─ theme.css       # 나중
   │  └─ view.js         # 나중
   │
   └─ settlement/
      ├─ theme.css       # 나중
      └─ view.js         # 나중
```

처음부터 JS/CSS까지 한 번에 옮기지 않는다.

---

# 73. production 구조 계획

```text id="d24a18"
productions/
└─ elisabeth-2026-6th/
   ├─ cast/
   │  └─ ...
   │
   └─ data/
      ├─ schedule.js
      └─ seat-map.js
```

원칙:

- 공연 일정 → production
- 캐스팅 → production
- 시즌 공식 배우 사진 → production
- 좌석 구성 → production 데이터
- 신문 폰트/색/배경 → theme
- auth/record 계산 → core

---

# 74. core 구조 계획

장기적으로:

```text id="wgw77z"
core/
├─ auth.js
├─ records.js
├─ analytics.js
├─ schedule.js
├─ settlement.js
├─ app-state.js
└─ seat/
```

단 지금 바로 대이동하지 않는다.

작은 단위로 진행.

---

# 75. 시스템과 테마 경계

## 시스템에 남겨야 하는 것

```text id="hb75jf"
달력형/목록형 전환
월 이동
회차 상세 열기
공연 데이터 조회
로그인
관극 기록
좌석 저장
정산 계산
지난 회차 필터
강홍석 필터
페어 계산
PNG export 호출 흐름
```

## 테마가 소유할 것

```text id="kvtswh"
폰트
색
배경
텍스처
사진
마스트헤드
달력 셀 모양
목록 카드
버튼
상세 시트 모양
정산판 배치
Export 이미지 디자인
애니메이션
장식
아이콘 스타일
```

즉 **기능 계약만 유지하고 DOM 구조까지 테마별로 바뀔 수 있는 방향**이다.

---

# 76. 현재 theme 분리 작업의 절대 조건

작업 전:

```text id="lf1xma"
루케니 화면
```

작업 후:

```text id="kv40sr"
루케니 화면
```

이 완전히 동일해야 한다.

지금은 새로운 디자인을 만드는 단계가 아니다.

**기존 디자인을 패키징하는 단계다.**

---

# 77. 다음 작업 우선순위

새 채팅에서 가장 먼저 진행할 단계.

## 1순위 — 루케니 theme skeleton

먼저:

```text id="rp6egt"
themes/elisabeth-2026-6th-lucheni/
```

만들기.

그리고 한 번에 너무 많이 말고:

### 1A
현재 루케니 이미지 이동.

```text id="8ft0k4"
calendar-photo.jpg
lead-photo.jpg
settlement-export-background.png
```

### 1B
현재 신문 폰트 이동.

### 1C
`og-image.png` 이동.

각 단계마다:

```text id="i43qp6"
경로 수정
SW 수정
cache version
CSP 확인
브라우저 검사
```

수행.

---

## 2순위 — cast production 분리

```text id="olde97"
cast/
→
productions/elisabeth-2026-6th/cast/
```

`settlement-export.js` 경로 수정.

52 이미지 invariant 검증.

`sample.jpg`는 별도 판단 후 정리.

---

## 3순위 — production data 분리

현재 `data.js`의:

```text id="95fbe3"
WORK
ACTORS
ROLES
PERFS
RANGE
SEAT_MAP
```

를 production 데이터로 분리.

단 이때 core helper와 dependency를 깨지 않게 transitional global API를 두는 게 안전하다.

---

## 4순위 — index inline script 외부화

현재 `index.html`의 앱 로직이 큰 inline script다.

이 때문에 디자인/경로 변경 때마다 CSP hash가 바뀐다.

외부화해서:

```text id="yicut1"
schedule app/core
theme rendering
```

을 나누는 것이 좋다.

이 작업 후 CSP 유지보수가 훨씬 쉬워진다.

---

## 5순위 — core/theme 분리

기능과 렌더링 분리.

기존 루케니 UI 그대로 유지하면서 진행.

---

## 6순위 — production-aware storage

새 공연 추가 전에 반드시:

```text id="938ict"
production_id
```

도입.

대상:

```text id="5tdb17"
Supabase records
local records
visit colors
favorite pairs
```

---

## 7순위 — theme registry

예:

```js id="ebwptz"
themes = {
  "elisabeth-2026-6th-lucheni": {...}
}
```

현재 default theme 설정.

---

## 8순위 — 테마 선택 UI

마지막에:

```text id="hs852z"
루케니 6연 ▾
```

추가.

그 전까지 사용자가 보는 화면은 현재 그대로.

---

# 78. 다음 리팩터링에서 한 번에 하지 말 것

다음 네 가지를 하나의 커밋에 같이 하지 않는다.

```text id="qchanu"
theme asset 이동
cast 이동
production data 분리
core JS 분리
```

각각 별도 commit 권장.

문제가 생겼을 때 원인을 바로 찾을 수 있어야 한다.

---

# 79. 최근 실제 장애에서 얻은 교훈

가장 중요.

## 실패 사례

자산 정리 패치에서 `assets/common/fonts/`를 미리 만들고:

```text id="4n1hma"
ref/fonts
→ assets/common/fonts
```

을 옮기려 했다.

source/destination이 동시에 존재해서 패치가 중단됐다.

결과:

```text id="er28t7"
fonts.css만 먼저 이동
fonts 이동에서 실패
```

이후 현재 상태를 먼저 검사하고 recovery patch를 만들었다.

### 교훈

파일 이동 패치는 **중간 실패가 발생할 수 있다는 전제**로 작성.

재실행 가능한 idempotent 구조 권장.

---

# 80. 또 반복하면 안 되는 시행착오 — CSP

자산 경로만 바꿨다고:

```text id="e8ot5r"
HTML syntax 정상
JS syntax 정상
```

이면 끝이라고 판단하지 않는다.

실제 브라우저에서:

```text id="kms5l2"
console CSP error
DOM render
버튼 이벤트
```

확인해야 한다.

---

# 81. 또 반복하면 안 되는 시행착오 — 인코딩

PowerShell에서 한글이 깨져 보인다고 파일 자체 인코딩이 깨졌다고 단정하지 않는다.

콘솔 표시 문제일 수 있다.

한글 파일을 임의 재인코딩하지 않는다.

---

# 82. 또 반복하면 안 되는 시행착오 — 좌석

좌석이 안 맞는다고:

```text id="vu36qd"
끝 좌석만 width 변경
margin-left
transform translate
```

같은 보정 금지.

데이터/geometry부터 확인.

---

# 83. 또 반복하면 안 되는 시행착오 — 대규모 파일 읽기

`data.js`, `index.html` 같은 큰 파일 전체를 매번 읽지 않는다.

Serena 또는 검색으로:

```text id="2cn24n"
symbol overview
find symbol
search pattern
관련 line
```

만 본다.

---

# 84. Serena 사용 방식

현재 local Serena 설정이 workspace에 존재한다.

`.serena/project.yml` 현재 주요 설정:

```text id="anub4j"
project_name: bollsar
language_servers:
  - typescript

encoding: utf-8
workspace:
  .
read_only: false
```

`.serena/` 자체는 `.gitignore`라 **로컬 전용**이다.

새 컴퓨터에서 clone만 해서는 Serena local 상태가 그대로 따라오지 않을 수 있다.

이미 Serena를 설치했다면 이 프로젝트를 `bollsar`로 활성화해서 사용.

주 용도:

```text id="e7go5d"
get_symbols_overview
find_symbol
find_referencing_symbols
search_for_pattern
```

같은 symbol-level 탐색.

대형 JS/HTML을 통째로 읽지 않는 용도.

사용자가 매번:

```text id="slemud"
Serena 써
```

라고 지시할 필요 없다.

ChatGPT/agent가 필요할 때 알아서 사용한다.

---

# 85. Codex with ChatGPT 사용 방식

이번 인수인계 작성 시 실제로 연결해 현재 workspace를 확인했다.

새 채팅에서도 우선:

```text id="38uixm"
workspace_info
git_status
list_directory
```

로 현재 저장소 확인.

현재 dedicated workspace 이름:

```text id="nb538y"
musicalender
```

Codex with ChatGPT 용도:

```text id="t45ji3"
실제 파일 구조 확인
현재 Git 상태 확인
특정 코드 검색
관련 line 읽기
staged/unstaged diff 확인
현재 코드와 대화 의도 비교
```

중요:

대화 기억보다 **현재 workspace를 우선한다.**

작업 시작 시:

> 이 문서에 쓰인 상태와 workspace가 다르면 현재 workspace를 기준으로 하고 차이를 사용자에게 알려라.

---

# 86. Ponytail 사용 방식

`AGENTS.md`에는:

```text id="dg2zkr"
Serena, Ponytail, Codex with ChatGPT가 사용 가능하면 항상 켜두고 적극 활용
```

이라고 되어 있다.

다만 현재 repository에서 Ponytail 전용 설정/코드 참조는 `AGENTS.md` 이외에는 확인되지 않았다.

따라서:

- runtime dependency가 아니다.
- 프로젝트 코드가 Ponytail에 의존하지 않는다.
- 사용 가능한 agent/tool이면 필요할 때 보조적으로 사용.
- 없다고 개발이 막히지 않는다.
- 사용하지 않았으면 사용했다고 말하지 않는다.

사용자가 매번 Ponytail을 직접 실행하라고 지시할 필요 없음.

---

# 87. Codex / Serena / Ponytail 공통 원칙

사용자는 도구를 설치했지만:

> 사용자가 매번 “이번에는 Serena”, “이번에는 Codex”라고 선택하는 구조가 아님.

assistant가 상황에 따라 자동 사용.

추천:

```text id="aa1vcq"
현재 repo 확인 → Codex with ChatGPT
심볼 단위 코드 탐색 → Serena
보조 agent 작업 → Ponytail 가능 시
```

---

# 88. 새 컴퓨터 Git 시작 절차

새 컴퓨터에 repo가 없으면:

```powershell id="4dgo2i"
git clone https://github.com/leejuhyeon-b4/musicalender.git
cd musicalender
git status
git log -1 --oneline
```

이미 clone되어 있으면:

```powershell id="c348sp"
git status
git pull origin main
```

단 `git status`에 로컬 변경이 있으면 무작정 pull하지 않는다.

현재 기준으로 기대하는 commit:

```text id="oz857c"
9cf75bf
```

branch:

```text id="4h0vj2"
main
```

working tree:

```text id="8zufeg"
clean
```

---

# 89. 현재 코드 vs 과거 문서 핵심 차이 요약

| 항목 | 현재 실제 코드 | 과거 의도 | 차이 이유 |
|---|---|---|---|
| Framework | HTML + Vanilla JS | Next.js + TS + Tailwind | 빠른 실사용 구현으로 정적 앱 정착 |
| 서비스 범위 | 강홍석 중심 | 다중 작품/배우 플랫폼 | 스코프 축소 |
| UI | 신문 테마 | 연보라 카드 UI | 디자인 방향 변경 |
| DB | `records` 중심 | works/roles/perfs 등 전체 DB | 공개 공연 데이터는 정적 JS로 단순화 |
| OCR | 없음 | Claude / Clova | 수동 입력 유지 |
| Offline 일정 | 없음 | PRD v3 계획 | 미구현 |
| 제보 | 없음 | 초기 핵심 기능 | 운영자 직접 관리로 변경 |
| 계정 메뉴 | logout/export/delete | password/MFA 포함 시점 있었음 | 단순화 요청 |
| 페어 즐겨찾기 | 최대 4 | PRD v2 최대 3 | 구현 과정에서 4로 변경 |
| 좌석 색 | 횟수별 서로 다른 색 선택 | 같은 색 진하기 | 실제 시인성 문제 |
| 좌석 테두리 | SVG 공유선 | CSS border 초기 구현 | 고DPI/이중선 문제 |
| 스케줄 | 11/15까지 | data.js 상단 주석은 10/23 | 주석 갱신 누락 |
| Theme 구조 | 아직 없음 | 과거에도 없음 | 현재 새롭게 추진 중 |

---

# 90. 현재 알려진 기술부채

우선순위 높은 것:

1. `data.js`가 너무 많은 역할을 갖고 있음.
2. `index.html` 메인 앱 JS가 inline이라 CSP 유지보수 불편.
3. `assets/common/fonts`가 사실상 현재 테마 전용.
4. 루케니 theme package 아직 없음.
5. `cast/`가 production scope가 아님.
6. `og-image.png`가 루트에 있음.
7. Supabase records에 `production_id` 없음.
8. visit colors에 production namespace 없음.
9. favorite pairs에 production namespace 없음.
10. `data.js` 상단 주석 일부 오래됨.
11. `SECURITY.md` 계정 기능 설명 오래됨.
12. `DESIGN2.md`는 실제 디자인과 다름.
13. `reviewer.md` 일부 좌석 QA 조건 오래됨.
14. `date-rollover.test.cjs`가 settlement externalization 이전 구조 일부 가정.
15. `.gitignore`에 사라진 `ref/drawing.jpg` rule 남음.
16. `cast/sample.jpg`는 미사용.
17. `vercel.json` CSP에 과거 hash들이 많이 누적되어 있고 일부 중복도 있어 장기적으로 정리 가능.
18. 관리자/OCR 파이프라인 없음.
19. PRD와 실제 구현이 많이 벌어져 있음.

---

# 91. 현재 알려진 런타임 문제

현재 handoff 시점에는 **확인된 치명적 런타임 버그 없음.**

최근 발생했던:

```text id="h57wdc"
스케줄 빈 화면
로그인 버튼 무반응
```

CSP 문제는 수정 완료.

로컬 headless Chrome 재검사 결과:

```text id="2i8947"
CSP / JS 오류 없음
스케줄 렌더 정상
```

그 수정까지 push 완료.

---

# 92. 앞으로 문서화 시 주의

PRD 파일을 무조건 현재 요구사항이라고 생각하지 않는다.

우선순위:

```text id="08zf2o"
1. 현재 사용자의 최신 결정
2. 현재 실제 코드
3. 이 인수인계 문서
4. PRD_v3
5. PRD_v2
6. PRD-1st
```

현재 코드와 과거 문서가 다르면:

```text id="4aekkg"
현재 코드 상태
과거 의도
변경 이유
```

를 따로 설명할 것.

---

# 93. 다음 새 채팅에서 첫 작업 추천

**바로 코드 수정부터 하지 말 것.**

먼저 Codex with ChatGPT로:

```text id="v8uckh"
workspace_info
git_status
list_directory
```

확인.

기대 상태:

```text id="90mtq0"
workspace musicalender
main
9cf75bf
clean
```

그다음:

> 루케니 테마의 비주얼 자산을 `themes/elisabeth-2026-6th-lucheni/`로 옮기기 위한 1단계 계획을 현재 실제 경로 기준으로 다시 확인

부터 시작.

첫 실제 이동은 작은 범위로 한다.

추천 첫 커밋:

```text id="0ducvi"
루케니 theme skeleton 생성
+
theme 전용 이미지 이동
```

폰트/OG/cast/data는 각각 후속 단계.

단 사용자가 원하면 이미지+폰트까지 한 단계로 묶을 수 있지만, 기본은 작게 나눈다.

---

# 94. 이번 리팩터링의 최종 목표 구조

최종적으로 대략:

```text id="iphcvz"
bollsar/
│
├─ core/
│  ├─ auth.js
│  ├─ records.js
│  ├─ analytics.js
│  ├─ schedule.js
│  ├─ settlement.js
│  └─ seat/
│
├─ productions/
│  └─ elisabeth-2026-6th/
│     ├─ data/
│     │  ├─ schedule.js
│     │  └─ seat-map.js
│     └─ cast/
│
├─ themes/
│  └─ elisabeth-2026-6th-lucheni/
│     ├─ schedule/
│     ├─ settlement/
│     ├─ fonts/
│     └─ assets/
│
├─ sources/
│
├─ assets/
│  └─ common/
│     ├─ gsap.min.js
│     ├─ html2canvas-1.4.1.min.js
│     └─ PWA icons
│
└─ ...
```

단 이 구조는 **목표 구조이며 현재 구현된 구조가 아니다.**

---

# 95. 가장 중요한 한 줄

> **현재 루케니 테마를 완전히 보존한 상태에서, 기능 시스템과 공연 데이터와 비주얼 테마를 천천히 분리한다. 화면은 지금 바꾸지 않는다.**

---

# 96. 새 ChatGPT에게 요청

이 프로젝트 작업 시 다음을 기본 행동으로 한다.

1. 항상 실제 workspace를 먼저 확인한다.
2. 대화 기억만 보고 현재 코드를 추측하지 않는다.
3. 큰 파일은 관련 symbol/line만 읽는다.
4. 한 단계씩 진행한다.
5. 사용자가 승인하기 전 대규모 이동을 하지 않는다.
6. 한글 파일은 byte-safe UTF-8 방식으로 수정한다.
7. `git add .` 금지.
8. 패치 후 실제 브라우저 동작을 검증한다.
9. inline JS를 바꾸면 CSP hash를 반드시 확인한다.
10. 좌석 문제 아니면 `seat-lines.js`를 건드리지 않는다.
11. 현재 루케니 UI가 조금이라도 바뀌면 리팩터링 성공으로 보지 않는다.
12. 미래 비주얼은 완전히 바뀔 수 있으므로 현재 폰트·색·신문 디자인을 core에 박지 않는다.

---

**여기까지가 현재 `볼살씨 / bollsar` 프로젝트 전체 인수인계 내용이다. Codex workspace/GitHub repository/로컬 폴더의 외부 이름은 별도 rename 전까지 `musicalender`일 수 있다.  
이 문서를 읽은 뒤 추가 설명을 요구하지 말고 Codex with ChatGPT로 현재 workspace 상태부터 확인한 뒤 다음 리팩터링 작업을 이어간다.**
