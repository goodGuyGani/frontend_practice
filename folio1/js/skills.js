document.addEventListener("DOMContentLoaded", () => {
  const sections = gsap.utils.toArray("section");

  let scrollTween = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: ".wrapper",
      pin: true,
      scrub: 0.5,
      snap: 1 / (sections.length - 1),
      start: "top top",
      end: 3000,
    },
  });

  gsap.to(".logo", {
    fontSize: "2.5rem",
    top: "4rem",
    scrollTrigger: {
      trigger: ".logo",
      start: "top top",
      end: 1500,
      scrub: 0.5,
    },
  });

  gsap.to(".line", {
    top: "50%",
    height: "100%",
    width: "100%",
    borderRadius: "0",
    scrollTrigger: {
      trigger: ".line",
      scrub: 2,
      start: "-150 center",
      end: 1400,
    },
  });

  gsap.from(".shape", {
    height: "1rem",
    left: "25%",
    width: "48vw",
    top: "183%",
    borderRadius: "10px",
    backgroundColor: "#e93f33",
    scrollTrigger: {
      trigger: ".shape",
      scrub: 2.3,
      start: "clamp(top bottom-=12%)",
      end: "+=25%",
    },
    // onComplete: () => {
    //   // Re-animate or perform any action after the animation is done
    //   gsap.to(".shape", {
    //     height: "1%",
    //     width: "50px",
    //     top: "301%",
    //     scrollTrigger: {
    //       trigger: ".shape",
    //       scrub: 2.3,
    //     },
    //   });
    // },
  });

  gsap.to(".cards", {
    top: "490%",
    scrollTrigger: {
      trigger: ".cards",
      scrub: 2,
      start: "clamp(top bottom-=12%)",
      end: "+=30%",
    },
  });

  document.querySelectorAll(".character").forEach((el) => {
    gsap.to(el.querySelector(".caption"), {
      x: 0,
      y: 0,
      scrollTrigger: {
        containerAnimation: scrollTween,
        trigger: el.querySelector(".caption"),
        start: "top bottom",
        end: "+=1000",
        scrub: 0.5,
      },
    });

    gsap.to(el.querySelector(".quote"), {
      y: 0,
      ease: "none",
      scrollTrigger: {
        containerAnimation: scrollTween,
        trigger: el.querySelector(".quote"),
        start: "top bottom",
        end: "+=20%",
        scrub: 0.5,
      },
    });

    gsap.to(el.querySelector(".nickname"), {
      y: 0,
      ease: "none",
      scrollTrigger: {
        containerAnimation: scrollTween,
        trigger: el.querySelector(".nickname"),
        start: "top bottom",
        end: "+=10%",
        scrub: 0.5,
      },
    });

    gsap.to(el.querySelector(".block"), {
      x: 0,
      ease: "none",
      scrollTrigger: {
        containerAnimation: scrollTween,
        trigger: el.querySelector(".block"),
        start: "top bottom",
        end: "+=" + window.innerWidth,
        scrub: 0.5,
      },
    });

    gsap.to(el.querySelector("img"), {
      y: 0,
      ease: "none",
      scrollTrigger: {
        containerAnimation: scrollTween,
        trigger: el.querySelector("img"),
        start: "top bottom",
        end: "+=50%",
        scrub: 0.5,
      },
    });

    gsap.to(el.querySelector(".huge-text"), {
      y: 0,
      ease: "none",
      scrollTrigger: {
        containerAnimation: scrollTween,
        trigger: el.querySelector(".huge-text"),
        start: "top bottom",
        end: "+=100%",
        scrub: 0.5,
      },
    });
  });
});
