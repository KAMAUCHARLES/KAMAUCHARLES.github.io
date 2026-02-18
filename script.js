// PARTICLE MESH SYSTEM
const canvas = document.getElementById("mesh-canvas");
const ctx = canvas.getContext("2d");
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let particlesArray = [];
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = "rgba(0, 247, 255, 0.15)";
        ctx.beginPath(); ctx.arc(this.x, this.y, 1, 0, Math.PI * 2); ctx.fill();
    }
}
function init() {
    particlesArray = [];
    for (let i = 0; i < 100; i++) particlesArray.push(new Particle());
}
function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dist = ((particlesArray[a].x - particlesArray[b].x)**2 + (particlesArray[a].y - particlesArray[b].y)**2);
            if (dist < 15000) {
                ctx.strokeStyle = `rgba(0, 247, 255, ${1 - dist/15000})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
            }
        }
    }
}
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
}

// MOBILE MENU
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('open');
});
document.querySelectorAll('#nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('open');
    });
});

// SCROLL REVEAL
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.section').forEach(s => observer.observe(s));

// FORM SUBMISSION
var form = document.getElementById("contact-form");
if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        var status = document.getElementById("form-status");
        var data = new FormData(event.target);
        fetch(event.target.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                status.innerHTML = "Thanks! Your message has been sent.";
                status.style.color = "var(--neon-blue)";
                form.reset();
            } else { status.innerHTML = "Oops! Problem submitting."; }
        }).catch(error => { status.innerHTML = "Error connecting."; });
    });
}

init();
animate();