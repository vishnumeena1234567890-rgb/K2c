const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

let betAmount = 10;
const betAmountEl = document.getElementById('betAmount');
const betButton = document.getElementById('betButton');

function setBetAmount(value) {
  betAmount = Math.max(1, Math.min(1000, value));
  betAmountEl.textContent = betAmount.toFixed(2);
  betButton.querySelector('span').textContent = betAmount.toFixed(2);
}

document.getElementById('minusBtn').addEventListener('click', () => setBetAmount(betAmount - 10));
document.getElementById('plusBtn').addEventListener('click', () => setBetAmount(betAmount + 10));
document.querySelectorAll('.quick-values button').forEach(button => {
  button.addEventListener('click', () => setBetAmount(Number(button.dataset.value)));
});

document.querySelectorAll('.bet-tabs button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.bet-tabs button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    showToast(`${button.dataset.mode} mode selected`);
  });
});

document.querySelectorAll('.table-tabs button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.table-tabs button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
  });
});

document.querySelectorAll('.bottom-nav button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.bottom-nav button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
  });
});

document.querySelectorAll('.category').forEach(category => {
  category.addEventListener('click', () => showToast(`${category.querySelector('strong').textContent} games selected`));
});

document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    document.getElementById('gamePanel').scrollIntoView({ behavior: 'smooth' });
    showToast(`${card.dataset.name} opened`);
  });
});

document.getElementById('viewTasks').addEventListener('click', () => showToast('Daily challenges opened'));
document.getElementById('detailBtn').addEventListener('click', () => showToast('Welcome to the practice arcade'));
document.getElementById('filterBtn').addEventListener('click', () => showToast('Showing all games'));

const canvas = document.getElementById('flightCanvas');
const ctx = canvas.getContext('2d');
const multiplierEl = document.getElementById('multiplier');
let running = false;
let elapsed = 0;
let animationId;

function drawScene(multiplier) {
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(73, 95, 190, .22)';
  ctx.lineWidth = 2;
  for (let x = 0; x < w; x += 70) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 65) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  const progress = Math.min(elapsed / 6500, 1);
  const x = 80 + progress * 430;
  const y = h - 70 - progress * progress * 260;

  ctx.beginPath();
  ctx.moveTo(70, h - 70);
  ctx.quadraticCurveTo(w * .42, h - 100, x, y);
  ctx.strokeStyle = '#ef326b';
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-.12 - progress * .18);
  ctx.fillStyle = '#ef326b';
  ctx.beginPath();
  ctx.moveTo(-58, 8); ctx.lineTo(38, -14); ctx.lineTo(58, 2); ctx.lineTo(20, 18); ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffb1c8';
  ctx.fillRect(-35, 12, 25, 8);
  ctx.restore();

  ctx.fillStyle = '#58a9ff';
  for (let i = 0; i < 14; i++) {
    const px = 20 + i * 52;
    const py = h - 25 - (i % 3) * 15;
    ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
  }
}

function animate(timestamp) {
  if (!elapsed) elapsed = timestamp;
  const time = timestamp - elapsed;
  const multiplier = 1 + time / 2300;

  if (time < 6500) {
    drawScene(multiplier);
    multiplierEl.textContent = `${multiplier.toFixed(2)}x`;
    animationId = requestAnimationFrame(animate);
  } else {
    running = false;
    elapsed = 0;
    drawScene(1);
    betButton.textContent = 'START';
  }
}

betButton.addEventListener('click', () => {
  if (running) {
    running = false;
    cancelAnimationFrame(animationId);
    elapsed = 0;
    drawScene(1);
    multiplierEl.textContent = '1.00x';
    betButton.innerHTML = 'START<br><span>' + betAmount.toFixed(2) + '</span>';
    showToast('Practice round stopped');
    return;
  }

  running = true;
  elapsed = 0;
  betButton.textContent = 'STOP';
  showToast('Practice round started');
  animationId = requestAnimationFrame(animate);
});

drawScene(1);
