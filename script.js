// ================= LOADER =================
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => loader.remove(), 500);
    }
});

// ================= ANIMAÇÃO SCROLL =================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll("section, .card").forEach(el => observer.observe(el));

// ================= PULSE BOTÃO =================
const whatsappBtn = document.querySelector(".btn-whatsapp");
if (whatsappBtn) {
    setInterval(() => {
        whatsappBtn.classList.toggle("pulse");
    }, 2200);
}
