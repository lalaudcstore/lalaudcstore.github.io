// ================================
// LOADER
// ================================
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = "none";
    }
});

// ================================
// ANIMAÇÃO DE SEÇÕES / CARDS
// ================================
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll("section, .card").forEach(el => {
    observer.observe(el);
});

// ================================
// SOM + WHATSAPP
// ================================
const clickSound = new Audio("sound/click.mp3");

// evita erro se o áudio ainda não carregou
clickSound.preload = "auto";

document.querySelectorAll(".btn-comprar").forEach(botao => {
    botao.addEventListener("click", function (e) {
        e.preventDefault(); // segura o link

        // toca o som
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});

        const produto = this.dataset.produto || "produto";
        const numero = "5547999416062";

        const mensagem = encodeURIComponent(
            `Olá! Tenho interesse em comprar ${produto}.`
        );

        const link = `https://wa.me/${numero}?text=${mensagem}`;

        // pequeno delay para o som tocar
        setTimeout(() => {
            window.open(link, "_blank");
        }, 300);
    });
});
// FAQ INTERATIVO
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;

    document.querySelectorAll(".faq-item").forEach((i) => {
      if (i !== item) i.classList.remove("active");
    });

    item.classList.toggle("active");
  });
});
