document.addEventListener("DOMContentLoaded", () => {

    /* ======================
       LOADER (CORRIGIDO)
    ====================== */
    window.addEventListener("load", () => {
        const loader = document.getElementById("loader");
        if (loader) {
            loader.style.opacity = "0";
            loader.style.pointerEvents = "none";
            setTimeout(() => {
                loader.style.display = "none";
            }, 500);
        }
    });

    /* ======================
       ANIMAÇÃO AO SCROLL
    ====================== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll("section, .card").forEach(el => {
        observer.observe(el);
    });

    /* ======================
       HOVER PREMIUM
    ====================== */
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.classList.add("hover-js");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("hover-js");
        });
    });

    /* ======================
       SOM AO CLICAR (SEGURO)
    ====================== */
    const clickSound = new Audio("sounds/click.mp3");
    clickSound.volume = 0.4;

    document.querySelectorAll(".card a").forEach(btn => {
        btn.addEventListener("click", () => {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
        });
    });

});
