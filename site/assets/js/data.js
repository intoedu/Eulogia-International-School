/*
  홈페이지에 들어가는 데이터. 자료가 오면 이 파일만 고치면 됩니다.
  - sample: true 인 항목은 초안용 샘플입니다. 실제 자료로 바꾸면 sample 을 지우세요.
  - 학생 이름은 본인·보호자 게시 동의를 받은 경우에만 씁니다. 동의 전에는 이니셜로 씁니다.
*/

/* 졸업생 진학 실적 (첫 화면 대학 깃발 + 진학 실적 표) */
window.EULOGIA_RESULTS = [
  { year: 2026, student: "M.J. 외", university: "○○ State University", state: "미국", scholarship: "75%", scholarshipName: "장학금 정식 명칭 확인 필요", route: "LCA Diploma", sample: true },
  { year: 2026, student: "졸업생", university: "○○ State University", state: "미국", scholarship: "75%", scholarshipName: "장학금 정식 명칭 확인 필요", route: "LCA Diploma", sample: true },
  { year: 2025, student: "졸업생", university: "○○ University", state: "미국", scholarship: "", scholarshipName: "", route: "LCA Diploma", sample: true },
  { year: 2025, student: "졸업생", university: "○○ Christian University", state: "미국", scholarship: "", scholarshipName: "", route: "LCA Diploma", sample: true },
  { year: 2024, student: "졸업생", university: "○○ College", state: "미국", scholarship: "", scholarshipName: "", route: "GED", sample: true },
  { year: 2023, student: "졸업생", university: "○○ State University", state: "미국", scholarship: "", scholarshipName: "", route: "LCA Diploma", sample: true }
];

/* 올해 장학금 소식 (첫 화면 장학금 카드) */
window.EULOGIA_HIGHLIGHT = {
  year: 2026,
  percent: "75%",
  label: "Scholarship",
  university: "○○ State University",
  students: "M.J. 외 ○명",
  note: "대학명·장학금 명칭·인원은 자료를 받으면 바뀝니다",
  sample: true
};

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
