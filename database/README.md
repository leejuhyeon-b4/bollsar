# Database sources

- `supabase-security.sql`: 관극 기록의 접근 제어·계정 삭제 설정 원본.
- `kinky-bell-setup.sql`: 킹키부츠 공개 누적 카운터와 증가 RPC 설정 원본.
- `checks/permissions.sql`: 관리자용 읽기 전용 카탈로그·권한 점검. 트랜잭션 자체가 읽기 전용입니다.

파일 위치 정리만 했으며 원격 DB에 SQL을 실행하지 않았습니다. 기존 적용 기록과 추가 설정은 루트 `SECURITY.md`를 확인하세요.
