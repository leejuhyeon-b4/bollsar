# 보안 배포 체크리스트

클라이언트 쪽 보호는 저장소에 반영되어 있지만 다음 항목은 Supabase 프로젝트 설정이라
배포 전에 대시보드에서 별도로 적용해야 한다.

1. [완료: 2026-09-11] `supabase-security.sql`을 원격 프로젝트에 적용했다. 임시 계정
   두 개로 `records`의 교차 조회·삽입·수정·삭제가 모두 차단됨을 확인했고 계정과
   테스트 데이터도 삭제했다.
2. [완료: 2026-09-11] Authentication → Sign In / Providers → Email의 비밀번호 최소
   길이를 8자로 설정했다. Supabase에 “대소문자 구분 없는 영문+숫자+특수문자” 선택지가
   없어 Required characters는 `No required characters`로 유지하며, 세 가지 조합은 앱에서
   검사한다. 공개 Auth API 직접 호출에는 조합 규칙이 강제되지 않는 잔여 위험이 있다.
3. Pro 플랜 이상이면 Authentication의 Leaked password protection을 켠다.
4. Authentication → Multi-Factor Authentication에서 TOTP 등록·검증을 허용한다.
5. Database → Security Advisor에서 경고가 없는지 확인한다.
6. 계정 삭제 후 기존 access token이 만료되기까지의 노출 시간을 줄이도록 JWT 만료 시간을
   짧게 유지한다.

현재 로그인 아이디는 내부 가상 이메일(`<아이디>@bollsar.app`)로 변환된다. 사용자가 받을
수 있는 이메일 주소가 아니므로 이메일 기반 “비밀번호 찾기”를 안전하게 제공할 수 없다.
분실 비밀번호 재설정을 제공하려면 실제 이메일 수집·검증 또는 별도 서버 복구 흐름을 먼저
도입해야 한다. 로그인 중 비밀번호 변경, TOTP 2단계 인증, 기록 내보내기, 계정 삭제는
계정 관리 화면에서 제공한다.
