const tl = gsap.timeline();

function revealSite() {
  tl.to(".pre-loader", 1, {
    opacity: 0,
    display: "none",
    ease: "power2.inOut",
  });

  tl.to(
    ".header-row",
    0.8,
    {
      top: 0,
      ease: "power4.inOut",
      stagger: {
        amount: 0.2,
      },
    },
    "-=1.2"
  );

  tl.from(
    ".navbar > *, .footer",
    2,
    {
      y: 40,
      opacity: 0,
      ease: "power4.inOut",
      stagger: {
        amount: 0.2,
      },
    },
    "-=1"
  );
}

tl.to(".header > h1", 2, {
  top: 0,
  ease: "power3.inOut",
  stagger: {
    amount: 0.3,
  },
}).to(".pre-loader-btn", 0.3, {
  opacity: 1,
  delay: 2,
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  gsap.from(".intro__title-pre", { x: 200, duration: 2, ease: "power3.inOut" });
  gsap.from(".intro__title-sub", {
    y: 50,
    duration: 2,
    ease: "bounce.out",
    delay: 0.2,
  });
  gsap.from(".intro__info", { y: 300, duration: 3 });
}
