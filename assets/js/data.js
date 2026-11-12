/*
  홈페이지에 들어가는 데이터. 자료가 오면 이 파일만 고치면 됩니다.
  - 학생 이름은 본인·보호자 게시 동의를 받은 경우에만 씁니다. 동의 전에는 이니셜이나 「학생 A」로 씁니다.
  - check: true 는 명칭·수치 확인이 필요한 항목입니다.
*/

/* 사이트 설정: 상담 신청서를 받을 메일 (현지 입학 상담 담당 도형래 선교사) */
window.EULOGIA_CONFIG = {
  applyEmail: "dhr2000@daum.net"
};

/* 첫 화면 사진 (순서대로 넘어감). 파일이 없는 사진, 화면에서 너무 크게 늘어나는 사진은 자동으로 빠집니다.
   pos: 사진에서 보여 줄 위치 (CSS object-position)
   private/ 사진은 사용 허락을 받기 전이라 공개 저장소에 없습니다. */
window.EULOGIA_SLIDES = [
  { src: "assets/img/k-classroom.jpg", place: "치앙마이 · 유아반 교실", pos: "50% 60%" },
  { src: "assets/img/building.jpg", place: "치앙마이 · Eulogia Vision Center", pos: "8% 50%" },
  { src: "assets/img/k-reading.jpg", place: "치앙마이 · 유아반 독서 공간", pos: "40% 55%" },
  { src: "assets/img/k-music.jpg", place: "치앙마이 · 유아반 음악실", pos: "55% 55%" },
  { src: "assets/img/private/bryan-dusk.jpg", place: "Bryan, Texas", pos: "62% 60%" },
  { src: "assets/img/private/am-aerial.jpg", place: "College Station · Texas A&M University", pos: "50% 45%" }
];

/* 율로기아 졸업생 합격 대학 (학교 제공 합격 포스터 기준 + 확인된 졸업 사례).
   위 텍사스 노선 누적 기록과 따로 표시. 학생 이름·인원수는 쓰지 않음.
   tag: 장학금 등 강조 표시 / key: 이름 있는 대학 굵게 */
window.EULOGIA_OWN = [
  { region: "미국", en: "USA", wide: true, schools: [
    { name: "Texas A&M University", key: true, tag: "전액 장학금" },
    { name: "Penn State University", key: true },
    { name: "Stony Brook University (SUNY)", key: true },
    { name: "University of Rochester", key: true },
    { name: "Fordham University", key: true },
    { name: "Baylor University", key: true },
    { name: "Saint Louis University", tag: "전액 장학금" },
    { name: "Miami University", tag: "Honors" },
    { name: "Calvin University", tag: "전액 + MK 장학금" },
    { name: "Coe College", tag: "전액 장학금" },
    { name: "Temple University" },
    { name: "Drexel University" },
    { name: "Bentley University" },
    { name: "Stevens Institute of Technology" },
    { name: "Wheaton College" },
    { name: "DePauw University" },
    { name: "DePaul University" },
    { name: "Hofstra University" },
    { name: "University of Tulsa" },
    { name: "Florida International University" },
    { name: "Cedarville University" },
    { name: "Southern Illinois University Edwardsville" },
    { name: "Robert Morris University" },
    { name: "Eastern Michigan University" }
  ] },
  { region: "아시아", en: "Asia", schools: [
    { name: "University of Macau", key: true, tag: "전액 장학금 · 기숙사 · 생활비", place: "마카오" },
    { name: "University of Science and Technology of Hanoi", place: "베트남" },
    { name: "S P Jain School of Global Management" },
    { name: "Assumption University", place: "방콕" }
  ] },
  { region: "한국", en: "Korea", schools: [
    { name: "Sungkyunkwan University", key: true, place: "성균관대학교" },
    { name: "SUNY Korea", place: "인천 송도" }
  ] },
  { region: "캐나다", en: "Canada", schools: [
    { name: "Simon Fraser University", key: true }
  ] },
  { region: "호주", en: "Australia", schools: [
    { name: "International College of Management, Sydney" }
  ] }
];


/* 텍사스 진학 경로 누적 합격 실적 (총 40명) — 같은 경로를 거친 학생들의 기록
   abbr: 첫 화면 대학 표시 약칭 / color: 대학 공식 상징색 참고 (로고는 쓰지 않음) */
window.EULOGIA_RESULTS = [
  { ko: "텍사스 A&M", university: "Texas A&M University", state: "TX", count: 4, scholarship: "최대 75%", note: "Corps of Cadets 장학금", abbr: "A&M", color: "#500000" },
  { ko: "럿거스대", university: "Rutgers University", state: "NJ", count: 8, abbr: "RU", color: "#CC0033" },
  { ko: "뉴욕주립대 스토니브룩", university: "Stony Brook University (SUNY)", state: "NY", count: 7, abbr: "SBU", color: "#990000" },
  { ko: "오하이오 주립대", university: "The Ohio State University", state: "OH", count: 6, abbr: "OSU", color: "#BB0000" },
  { ko: "위스콘신대 매디슨", university: "University of Wisconsin–Madison", state: "WI", count: 3, abbr: "UW", color: "#C5050C" },
  { ko: "뉴욕주립대 버펄로", university: "University at Buffalo (SUNY)", state: "NY", count: 3, abbr: "UB", color: "#005BBB" },
  { ko: "뉴욕주립대 빙햄턴", university: "Binghamton University (SUNY)", state: "NY", count: 1, abbr: "BU", color: "#005A43" },
  { ko: "몽클레어 주립대", university: "Montclair State University", state: "NJ", count: 1, abbr: "MSU", color: "#C8102E" },
  { ko: "페이스대", university: "Pace University", state: "NY", count: 1, abbr: "PACE", color: "#003C7D" },
  { ko: "펜실베이니아 주립대", university: "Penn State University", state: "PA", count: 1, abbr: "PSU", color: "#041E42" },
  { ko: "포덤대", university: "Fordham University", state: "NY", count: 1, abbr: "FU", color: "#860038" },
  { ko: "에머슨 칼리지", university: "Emerson College", state: "MA", count: 1, abbr: "EC", color: "#4A2C82" },
  { ko: "메릴랜드 주립대", university: "University of Maryland", state: "MD", count: 1, abbr: "UMD", color: "#E21833" },
  { ko: "텍사스 크리스천대", university: "Texas Christian University (TCU)", state: "TX", count: 1, abbr: "TCU", color: "#4D1979" },
  { ko: "텍사스 주립대", university: "텍사스 주립대 (영문 명칭 확인 필요)", state: "TX", count: 1, check: true, abbr: "TX", color: "#501214" }
];

/* 첫 화면 숫자 */
window.EULOGIA_STATS = {
  admits: 40,
  scholarshipMax: "75%"
};

/* Texas A&M 장학금 실제 사례 (1학기, 개인 정보 제외) */
window.EULOGIA_AID_CASE = {
  term: "1학기",
  charges: 29069.52,
  aid: 16973.00,
  net: 12096.52
};

/* 블린 칼리지를 거쳐 텍사스 A&M에 진학한 기수 (기수마다 첫 학기 GPA 4.0 만점자 배출, 화면에는 인원수 표시 안 함. 텍사스 A&M 진학생 중 3.83도 있음) */
window.EULOGIA_COHORTS = [
  { label: "1기", n: 5 },
  { label: "2기", n: 5 },
  { label: "3기", n: 4 },
  { label: "5기", n: 1 }
];

/* 같은 경로 학생 성장 기록 (이름 제외) */
window.EULOGIA_GROWTH = [
  { label: "학생 A", tag: "꾸준한 상승", gpa: [["9학년", 1.83], ["10학년", 2.92], ["11학년", 3.84]], notes: ["10학년 Cougar of the Year", "11학년 전 과목 A (Honor Roll)"] },
  { label: "학생 B", tag: "STEM 상위권", gpa: [["9학년", 3.80], ["10학년", 3.81], ["11학년", 3.90]], notes: ["10·11학년 전 과목 A (Honor Roll)", "AP 수학 이수 · 학년 1위"] }
];

/* 2026-2027 학사 일정 (기존 학교 일정표에서 옮김) */
window.EULOGIA_CALENDAR = [
  { cat: "staff", ko: "교사 연수", en: "Supervisor's Training", start: "2026-07-13", end: "2026-07-17" },
  { cat: "term", ko: "개학", en: "Start of School Year", start: "2026-07-20", end: "2026-07-20" },
  { cat: "term", ko: "1학기", en: "First Quarter", start: "2026-07-20", end: "2026-09-18" },
  { cat: "break", ko: "학기 방학", en: "Quarter Break", start: "2026-09-21", end: "2026-09-25" },
  { cat: "term", ko: "2학기", en: "Second Quarter", start: "2026-09-28", end: "2026-12-04" },
  { cat: "event", ko: "지역 학생 대회", en: "Regional Student Convention", start: "2026-11-23", end: "2026-11-27" },
  { cat: "break", ko: "겨울 방학", en: "Christmas Break", start: "2026-12-07", end: "2027-01-01" },
  { cat: "term", ko: "3학기", en: "Third Quarter", start: "2027-01-04", end: "2027-03-05" },
  { cat: "term", ko: "4학기", en: "Fourth Quarter", start: "2027-03-08", end: "2027-05-28" },
  { cat: "event", ko: "CEC", en: "CEC", start: "2027-03-10", end: "2027-03-12" },
  { cat: "break", ko: "봄 방학", en: "Spring Break", start: "2027-03-29", end: "2027-04-16" },
  { cat: "break", ko: "여름 방학", en: "Summer Break", start: "2027-05-31", end: "2027-07-18" }
];
