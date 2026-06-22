/* =============================================
   GOLDEN PASS — main.js
   1. 스크롤 reveal 애니메이션
   2. 네비게이션 데모 애니메이션 (스크롤 진입 시 트리거)
   3. 차량 타입 토글 (소방차 / 구급차)
   ============================================= */

/* ──────────────────────────────────────
   0. 차량 타입 상태
────────────────────────────────────── */
let currentVehicle = 'fire'; // 'fire' | 'ambu'

const VEHICLE = {
  fire: {
    icon: '🚒',
    msg: '소방차 300m 후방 접근! \u00A0우측 차선으로 밀착해 주세요',
    barClass: '',      // 기본 레드
    truckBg: '#E8200A',
    ringColor: 'rgba(232,32,10,0.5)',
  },
  ambu: {
    icon: '🚑',
    msg: '구급차 300m 후방 접근! \u00A0갓길로 비켜 생명을 지켜주세요',
    barClass: 'ambu-mode',  // 파란색
    truckBg: '#1565C0',
    ringColor: 'rgba(55,138,221,0.5)',
  },
};

function switchVehicle(type) {
  currentVehicle = type;

  /* 버튼 active 상태 */
  const btnFire = document.getElementById('btnFire');
  const btnAmbu = document.getElementById('btnAmbu');
  if (btnFire && btnAmbu) {
    btnFire.classList.remove('active', 'fire-active', 'ambu-active');
    btnAmbu.classList.remove('active', 'fire-active', 'ambu-active');
    if (type === 'fire') {
      btnFire.classList.add('active', 'fire-active');
    } else {
      btnAmbu.classList.add('active', 'ambu-active');
    }
  }

  /* 지도 위 트럭 색상 + 이모지 */
  const truck = document.getElementById('mapTruck');
  const truckIcon = document.getElementById('mapTruckIcon');
  const ring = document.getElementById('mapTruckRing');
  if (truck)     truck.style.background = VEHICLE[type].truckBg;
  if (truckIcon) truckIcon.textContent  = VEHICLE[type].icon;
  if (ring)      ring.style.borderColor = VEHICLE[type].ringColor;

  /* 알림 바 아이콘 + 텍스트 + 배경색 */
  const bar     = document.getElementById('naviAlertBar');
  const alertIcon = document.getElementById('naviAlertIcon');
  const alertMsg  = document.getElementById('naviAlertMsg');
  if (alertIcon) alertIcon.textContent = VEHICLE[type].icon;
  if (alertMsg)  alertMsg.textContent  = VEHICLE[type].msg;
  if (bar) {
    bar.classList.remove('ambu-mode');
    if (VEHICLE[type].barClass) bar.classList.add(VEHICLE[type].barClass);
  }

  /* 애니메이션 리셋 후 재시작 */
  naviAnimated = false;
  [bar, document.getElementById('naviAlertBlink'),
   document.getElementById('naviArrows'), document.getElementById('naviToast')]
    .forEach(el => { if (el) { el.classList.remove('animate'); void el.offsetWidth; } });
  startNaviAnimation();
}

/* ──────────────────────────────────────
   1. SCROLL REVEAL
   .reveal 클래스 요소가 뷰포트에 들어오면
   .visible 클래스를 추가해 페이드업 효과
────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

/* 히어로 섹션은 페이지 로드 직후 바로 표시 */
document.querySelectorAll('#hero .reveal').forEach(el => {
  setTimeout(() => el.classList.add('visible'), 100);
});


/* ──────────────────────────────────────
   2. 차량 내비게이션 데모 애니메이션
   #uidemo 섹션이 뷰포트에 진입할 때 시작
   7초 주기로 루프 반복
────────────────────────────────────── */
let naviAnimated = false;

function startNaviAnimation() {
  if (naviAnimated) return;
  naviAnimated = true;

  const bar    = document.getElementById('naviAlertBar');
  const blink  = document.getElementById('naviAlertBlink');
  const arrows = document.getElementById('naviArrows');
  const truck  = document.getElementById('mapTruck');
  const ring   = document.getElementById('mapTruckRing');
  const range  = document.getElementById('mapRange');
  const toast  = document.getElementById('naviToast');

  /* Phase 1 — 즉시: 소방차 이동 + 파동링 + 반경 원 시작 */
  if (truck) truck.classList.add('animate');
  if (ring)  ring.classList.add('animate');
  if (range) range.classList.add('animate');

  /* Phase 2 — 0.8s: 알림 바 위에서 드롭다운 */
  setTimeout(() => {
    if (bar) bar.classList.add('animate');
  }, 800);

  /* Phase 3 — 1.4s: 빨간 점 깜빡 + 화살표 흐름 시작 */
  setTimeout(() => {
    if (blink)  blink.classList.add('animate');
    if (arrows) arrows.classList.add('animate');
  }, 1400);

  /* Phase 4 — 3.5s: 토스트 팝업 (+5점) */
  setTimeout(() => {
    if (toast) toast.classList.add('animate');
  }, 3500);

  /* Phase 5 — 7s: 리셋 후 루프 재시작 */
  setTimeout(() => {
    naviAnimated = false;

    /* animate 클래스를 제거하고 reflow를 강제해 애니메이션 재시작 */
    [bar, blink, arrows, toast].forEach(el => {
      if (el) {
        el.classList.remove('animate');
        void el.offsetWidth; /* reflow trigger */
      }
    });

    startNaviAnimation();
  }, 7000);
}

/* #uidemo 섹션이 25% 이상 보일 때 애니메이션 시작 */
const naviSection = document.getElementById('uidemo');

const naviObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startNaviAnimation();
    }
  });
}, { threshold: 0.25 });

if (naviSection) naviObserver.observe(naviSection);
