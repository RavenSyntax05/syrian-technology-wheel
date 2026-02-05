const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");

const prizes = [
  { text: "حظ أوفر", chance: 65, win: false, color: "#cfd8dc" },
  { text: "ستاند مراوح", chance: 11, win: true, color: "#42a5f5" },
  { text: "ساعة ذكية", chance: 11, win: true, color: "#66bb6a" },
  { text: "كيبورد مضيئ", chance: 11, win: true, color: "#ffca28" },
  { text: "لابتوب ميني", chance: 2, win: true, color: "#ef5350" }
];

const sliceAngle = (2 * Math.PI) / prizes.length;
let currentRotation = 0;

/* رسم العجلة (خانات متساوية) */
function drawWheel() {
  prizes.forEach((p, i) => {
    const start = i * sliceAngle;
    const end = start + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 150, start, end);
    ctx.fillStyle = p.color;
    ctx.fill();

    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(start + sliceAngle / 2);
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "right";
    ctx.fillText(p.text, 120, 5);
    ctx.restore();
  });
}

drawWheel();

/* اختيار دقيق حسب النِّسَب */
function weightedPick() {
  const r = Math.random() * 100;
  let sum = 0;
  for (let p of prizes) {
    sum += p.chance;
    if (r < sum) return p;
  }
}

/* احتفال */
function confetti() {
  for (let i = 0; i < 120; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.backgroundColor =
      ["#f44336", "#4caf50", "#2196f3", "#ffeb3b"][Math.floor(Math.random() * 4)];
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3000);
  }
}

/* لف العجلة */
function spin() {
  spinSound.play();

  const result = weightedPick();
  const index = prizes.indexOf(result);

  const spins = 5;
  const angle =
    spins * 360 +
    (360 - (index * 360 / prizes.length + 360 / prizes.length / 2));

  currentRotation += angle;
  canvas.style.transition = "transform 4s ease-out";
  canvas.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    spinSound.pause();
    spinSound.currentTime = 0;

    if (result.win) {
      winSound.play();
      confetti();
      document.getElementById("result").innerHTML =
        `🎉 مبروك!<br>ربحت: <b>${result.text}</b> 🎊`;
    } else {
      document.getElementById("result").innerHTML =
        `😢 حظ أوفر المرة القادمة`;
    }
  }, 4000);
}

/* CSS للاحتفال */
const style = document.createElement("style");
style.innerHTML = `
.confetti {
  position: fixed;
  top: -10px;
  width: 10px;
  height: 10px;
  animation: fall 3s linear;
}
@keyframes fall {
  to { transform: translateY(110vh) rotate(360deg); }
}`;
document.head.appendChild(style);