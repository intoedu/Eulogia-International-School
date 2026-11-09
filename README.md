# EULOGIA CHIANGMAI 홈페이지

율로기아(치앙마이) 학교 홈페이지입니다. 빌드 도구 없이 바로 열리는 정적 사이트입니다.

- 사이트 주소: https://intoedu.github.io/Eulogia-International-School/ (GitHub Pages, main 브랜치 맨 위 폴더)
- main에 변경이 들어가면 1~2분 뒤 사이트에 자동으로 반영됩니다.

## 폴더

| 경로 | 내용 |
|---|---|
| `index.html` | 홈페이지 |
| `assets/css/style.css` | 디자인 |
| `assets/js/data.js` | 진학 실적·성장 기록·학사 일정 데이터 (자료가 오면 이 파일만 고침) |
| `assets/js/main.js` | 화면 동작 (노선도, 그래프, 검색, 신청서) |
| `assets/img/` | 로고·학교 사진 |
| `docs/prep/` | 제작 준비 자료 (진단, 질문지, 명세, 점검표 등) |

## 사진

학생 얼굴이 나온 사진과 사용 허락을 받지 않은 외부 사진은 저장소에 올리지 않습니다 (`assets/img/private/`는 `.gitignore`로 제외). 그 자리에는 「사진 준비 중」이 보입니다.

## 초안 표시

정식 오픈 전에는 `index.html`의 `noindex` 줄로 검색엔진 노출을 막아 둡니다. 오픈할 때 이 줄을 지웁니다.
