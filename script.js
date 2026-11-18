document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
  // 1. Efeito de desembaralhar e digitar texto (Scramble / Decode effect na nota da dobra 1)
  const scrambleElements = document.querySelectorAll(".scramble-text");
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789§@#$*&";

  function runScramble(el, text, duration = 1400, delay = 500) {
    setTimeout(() => {
      const totalChars = text.length;
      const startTime = performance.now();

      function frame(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const revealedCount = Math.floor(progress * totalChars);

        let result = "";
        for (let i = 0; i < totalChars; i++) {
          if (i < revealedCount) {
            result += text[i];
          } else if (text[i] === " " || text[i] === "." || text[i] === ",") {
            result += text[i];
          } else {
            result += glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        }
        el.textContent = result;

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          el.textContent = text;
        }
      }
      requestAnimationFrame(frame);
    }, delay);
  }

  scrambleElements.forEach((el, index) => {
    const target = el.getAttribute("data-text") || el.textContent;
    el.textContent = "";
    runScramble(el, target, 1400, 450 + index * 450);
  });

  // 2. IntersectionObserver para animações no scroll (aparece ao descer e ao subir)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -30px 0px"
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else {
        // Reaparece quando o usuário sobe ou desce o scroll novamente
        entry.target.classList.remove("is-visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    revealObserver.observe(el);
  });
});
