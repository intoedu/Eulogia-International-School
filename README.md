# EULOGIA CHIANGMAI 홈페이지

율로기아(치앙마이) 학교 홈페이지입니다. 빌드 도구 없이 바로 열리는 정적 사이트입니다.

- 사이트 주소: https://eulogia.co.kr/ (GitHub Pages, main 브랜치 맨 위 폴더 · 도메인은 가비아, 맨 위 `CNAME` 파일로 연결)
- 예전 주소 https://intoedu.github.io/Eulogia-International-School/ 로 들어오면 새 도메인으로 자동 이동
- main에 변경이 들어가면 1~2분 뒤 사이트에 자동으로 반영됩니다.

## 폴더

| 경로 | 내용 |
|---|---|
| `index.html` | 홈페이지 |
| `assets/css/style.css` | 디자인 |
| `assets/js/data.js` | 진학 실적·성장 기록·학사 일정 데이터 (자료가 오면 이 파일만 고침) |
| `assets/js/main.js` | 화면 동작 (노선도, 그래프, 검색, 신청서) |
| `assets/img/` | 로고·학교 사진 |
| `privacy.html` | 개인정보 처리방침 (2026-11-17 시행) |
| `404.html` | 없는 주소로 들어왔을 때 보이는 페이지 (GitHub Pages 주소 기준 경로) |
| `docs/prep/` | 제작 준비 자료 (진단, 질문지, 명세, 점검표 등) |

## 상담 신청서

서버 없이 동작합니다. 보내기를 누르면 내용이 채워진 메일이 신청하는 분의 메일 앱에서 열리고, `assets/js/data.js`의 `applyEmail` 주소(현재 현지 입학 상담 담당 dhr2000@daum.net)로 보내집니다.

## 사진

학생 얼굴이 나온 사진과 사용 허락을 받지 않은 외부 사진은 저장소에 올리지 않습니다 (`assets/img/private/`는 `.gitignore`로 제외). 그 자리에는 「사진 준비 중」이 보입니다.

## 검색 노출

2026-11-17 정식 공개: `noindex`를 지웠고, `robots.txt`·`sitemap.xml`로 검색엔진에 사이트를 알립니다. 404 페이지만 검색에서 뺍니다.

## 학교 이름과 교표

- 머리말: **EULOGIA Christian School** · 새 교표(`assets/img/logo.jpg`)
- 하단: **EULOGIA LANGUAGE SCHOOL** · 언어학교 교표(`assets/img/logo-language.jpg`)
