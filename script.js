const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");

const prizes = [
  { text: "حظ أوفر", chance: 65, color: "#b0bec5" },
  { text: "ستاند مراوح", chance: 11, color: "#42a5f5" },
  { text: "ساعة ذكية", chance: 11, color: "#66bb6a" },
  { text: "كيبورد مضيئ", chance: 11, color: "#ffca28" },
  { text: "لابتوب ميني", chance: 2, color: "#ef5350" }
];

const sliceAngle = (2 * Math.PI) / prizes.length;
let currentRotation = 0;

/* رسم العجلة بخانات متساوية */
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

/* اختيار الفوز حسب النِسَب فقط */
function weightedPick() {
  const r = Math.random() * 100;
  let sum = 0;
  for (let p of prizes) {
    sum += p.chance;
    if (r <= sum) return p;
  }
}

/* لف العجلة */
function spin() {
  spinSound.play();

  const win = weightedPick();
  const index = prizes.indexOf(win);

  const spins = 5;
  const targetAngle =
    360 * spins +
    (360 - (index * 360 / prizes.length + 360 / prizes.length / 2));

  currentRotation += targetAngle;

  canvas.style.transition = "transform 4s ease-out";
  canvas.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    spinSound.pause();
    spinSound.currentTime = 0;
    winSound.play();

    document.getElementById("result").innerHTML =
      `🎉 مبروك!<br>ربحت: <b>${win.text}</b> 🎊`;
  }, 4000);
}
