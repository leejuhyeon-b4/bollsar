# Lola mannequin — pre-material blockout

승인된 hero와 4-view 두 이미지를 기준으로 만든 형태 검토용 Blender blockout입니다.
모델링 장면: `LOLA_Blockout_01`. 최초 기본 `Scene`은 별도로 보존했습니다.

## 확인할 파일

- `lola-blockout.blend`: 현재 모델과 검사 카메라·조명.
- `review.html`: 8방향과 6개 근접 검수 이미지, 원본 PNG 링크.
- `eight-view-contact-sheet.png`: 45도 간격 8방향 모음.
- `inspection-contact-sheet.png`: opening 5개 시점과 open-back 근접뷰 모음.
- `view_000.png` ~ `view_315.png`: 45도 간격 8개 원본 렌더.
- `opening_close_000/030/060/090.png`, `opening_close_low_angle.png`: opening 내부 검사.
- `open_back_close.png`: 실제 메시 경계로 열린 등 파임 확인.
- `object_manifest.json`, `camera_manifest.json`: 오브젝트 구조와 카메라 조건.
- `geometry_inspection.json`: 절단면·빈 내부 노출 검사 결과, 45개 광선.

## 구조

| Collection | 개수 | 내용 |
|---|---:|---|
| 01_Mannequin | 3 | 슬림한 neck-cut 몸통, 절단면이 닫힌 양쪽 허벅지 |
| 02_Gown | 3 | strapless/open-back bodice, waist, opening이 있는 일체형 skirt/train |
| 03_Boxing_Shorts | 6 | waistband, hip yoke, 양쪽 다리통과 hem |
| 04_Gloves_Strap | 7 | 한 쌍의 fist/thumb/cuff와 목 strap |
| 05_Accent | 1 | 작고 독립된 sheer 위치 표시용 불투명 메시 |
| 90_Studio | 5 | floor, 3개 area light, 검사 카메라 |

모델 20개 + 촬영용 5개 = 현재 장면 25개 오브젝트.
앞쪽은 -Y, 착용자 오른쪽은 -X, 위쪽은 +Z입니다.
8방향은 직교 배율 3.7m, 타깃 (0, 0.65, 1.29), 거리 8m, 고도 10도,
1100×1100으로 고정하고 방위각만 변경했습니다. 0도 정면, 90도 오른쪽,
180도 후면입니다. 근접 검수 카메라는 별도 배율/고도를 사용합니다.

## 단계와 검수

단순 white / graphite / black 식별 색상만 사용했습니다. 고급 재질, 세부 주름,
transparency, rig, animation, secondary motion, GLB export는 만들지 않았습니다.
Sheer accent는 투명 재질이 아니라 위치와 작은 면적만 확인하는 불투명 proxy입니다.
Train은 스커트와 연속되는 입체 곡면이며 Solidify 두께가 있습니다.
Open-back에는 등을 가로막는 의상 면이 없습니다.

형태 승인을 기다리는 blockout이며 최종 에셋이 아닙니다.
`diagnostics/`의 초기 `preview_*.png`는 수정 전 진단 이미지입니다. 승인 검토에는 `view_*.png`와
`opening_close_*.png`, `open_back_close.png` 및 `review.html`을 사용하세요.
`diagnostics/lola-blockout.blend1`은 Blender 자동 백업입니다.

## 재현용 작업 파일

- `build_blockout.py`: 빈 Blender 환경에서 새 장면을 생성합니다. 동일 장면이 있으면 중단합니다.
- `render_inspection.py`: 저장된 장면에서 Cycles CPU로 14개 검수 렌더를 출력합니다.
- `verify_blockout.py`: Blender 내부에서 기하 구조와 opening 광선 검사를 실행합니다.
- `make_review.ps1`: 기존 렌더를 재해석하지 않고 모음판과 HTML 갤러리로 정리합니다.

원본 레퍼런스와 기존 저장소 파일은 변경하지 않았으며 Git stage/commit/push도 수행하지 않았습니다.
