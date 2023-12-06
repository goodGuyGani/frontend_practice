// Import necessary functions and classes
import { preloadFonts, preloadImages } from "./utils.js";
import { Item } from "./item.js";
import { ThumbGrid } from "./thumbGrid.js";
import { ContentItem } from "./contentItem.js";
import { MenuItem } from "./menuItem.js";

// Define a variable to store Lenis smooth scrolling object
let lenis;

// Function to initialize Lenis for smooth scrolling
const initSmoothScrolling = () => {
  // Instantiate the Lenis object with specified properties
  lenis = new Lenis({
    lerp: 0.1, // Lower values create a smoother scroll effect
    smoothWheel: true, // Enables smooth scrolling for mouse wheel events
  });

  // Update ScrollTrigger each time the user scrolls
  lenis.on("scroll", () => ScrollTrigger.update());

  // Define a function to run at each animation frame
  const scrollFn = (time) => {
    lenis.raf(time); // Run Lenis' requestAnimationFrame method
    requestAnimationFrame(scrollFn); // Recursively call scrollFn on each frame
  };
  // Start the animation frame loop
  requestAnimationFrame(scrollFn);
};

// Start preloading fonts
preloadFonts("qsy7khk").then(() => {
  // Once fonts are loaded, remove the 'loading' class from the body, ending the loading state
  document.body.classList.remove("loading");
  // Initialize smooth scrolling
  initSmoothScrolling();
  // Select all elements with the class 'content-wrap', and for each, create a new instance of the Item class
  [...document.querySelectorAll(".content-wrap")].forEach((element) => {
    new Item(element);
  });
});

const triggerFlipOnScroll = (galleryEl, options) => {
  // Default settings for Flip and ScrollTrigger
  let settings = {
    flip: {
      absoluteOnLeave: false,
      absolute: false,
      scale: true,
      simple: true,
      //...
    },
    scrollTrigger: {
      start: "center center",
      end: "+=300%",
    },
    stagger: 0,
  };

  // Merge default settings with options provided when calling the function
  settings = Object.assign({}, settings, options);

  // Select elements within the gallery that will be animated
  const galleryCaption = galleryEl.querySelector(".caption2");
  const galleryItems = galleryEl.querySelectorAll(".gallery__item");
  const galleryItemsInner = [...galleryItems]
    .map((item) => (item.children.length > 0 ? [...item.children] : []))
    .flat();

  // Temporarily add the final class to capture the final state
  galleryEl.classList.add("gallery--switch");
  const flipstate = Flip.getState([galleryItems, galleryCaption], {
    props: "filter, opacity",
  });

  // Remove the final class to revert to the initial state
  galleryEl.classList.remove("gallery--switch");

  // Create the Flip animation timeline
  const tl = Flip.to(flipstate, {
    ease: "none",
    absoluteOnLeave: settings.flip.absoluteOnLeave,
    absolute: settings.flip.absolute,
    scale: settings.flip.scale,
    simple: settings.flip.simple,
    scrollTrigger: {
      trigger: galleryEl,
      start: settings.scrollTrigger.start,
      end: settings.scrollTrigger.end,
      pin: galleryEl.parentNode,
      scrub: true,
    },
    stagger: settings.stagger,
  });

  // If there are inner elements in the gallery items, animate them too
  if (galleryItemsInner.length) {
    tl.fromTo(
      galleryItemsInner,
      {
        scale: 2,
      },
      {
        scale: 1,
        scrollTrigger: {
          trigger: galleryEl,
          start: settings.scrollTrigger.start,
          end: settings.scrollTrigger.end,
          scrub: true,
        },
      },
      0
    );
  }
};

// Function to apply scroll-triggered animations to various galleries
// Apply scroll-triggered animations to each gallery with specific settings
const scroll = () => {
  // Define the gallery IDs and their options
  const galleries = [
    {
      id: "#gallery-1",
      options: { flip: { absoluteOnLeave: true, scale: false } },
    },
    { id: "#gallery-2" },
    {
      id: "#gallery-3",
      options: {
        flip: { absolute: true, scale: false },
        scrollTrigger: { start: "center center", end: "+=900%" },
        stagger: 0.05,
      },
    },
    { id: "#gallery-4" },
    { id: "#gallery-5" },
    { id: "#gallery-6" },
    { id: "#gallery-7" },
    { id: "#gallery-8", options: { flip: { scale: false } } },
    { id: "#gallery-9" },
  ];

  // Loop through the galleries and apply the scroll-triggered animations
  galleries.forEach((gallery) => {
    const galleryElement = document.querySelector(gallery.id);
    triggerFlipOnScroll(galleryElement, gallery.options);
  });
};

// Preload images, initialize smooth scrolling, apply scroll-triggered animations, and remove loading class from body
preloadImages(".gallery__item").then(() => {
  initSmoothScrolling();
  scroll();
  document.body.classList.remove("loading");
});

let thumbGrids = [];
[...document.querySelectorAll(".thumbgrid-wrap > .thumbgrid")].forEach(
  (thumbGrid) => {
    thumbGrids.push(new ThumbGrid(thumbGrid));
  }
);

// Content items
let contentItems = [];
[...document.querySelectorAll(".content5-wrap > .content5")].forEach(
  (contentItem) => {
    contentItems.push(new ContentItem(contentItem));
  }
);

// Menu items
const menu = document.querySelector(".menu");
let menuItems = [];
[...menu.querySelectorAll(".menu__item")].forEach((menuItem, position) => {
  menuItems.push(
    new MenuItem(menuItem, thumbGrids[position], contentItems[position])
  );
});

// menu || content
let mode = "menu";
// Check if the animation is in progress
let isAnimating = false;

for (const menuItem of menuItems) {
  // Mouseenter/Mouseleave events: show thumbs / Hide thumbs
  menuItem.DOM.el.addEventListener("mouseenter", () => {
    // Clear previous timeout to avoid unwanted triggers
    clearTimeout(menuItem.mouseEnterTimeout);

    if (menuItem.leaveTL) {
      menuItem.leaveTL.kill();
    }

    if (mode === "content5") return;

    menuItem.mouseEnterTimeout = setTimeout(() => {
      menuItem.thumbGrid.DOM.el.classList.add("thumbgrid--current");

      menuItem.enterTL = gsap
        .timeline({
          defaults: {
            duration: 0.5,
            ease: "expo",
          },
        })
        .addLabel("start", 0)
        .to(
          menuItem.DOM.title,
          {
            x: 0,
          },
          "start"
        )
        .fromTo(
          menuItem.DOM.description,
          {
            opacity: 0,
            yPercent: 50,
          },
          {
            opacity: 1,
            yPercent: 0,
          },
          "start"
        )
        .fromTo(
          menuItem.thumbGrid.DOM.items,
          {
            opacity: 0,
            scale: 0.5,
          },
          {
            stagger: 0.045,
            opacity: 1,
            scale: 1,
          },
          "start"
        );
    }, 20);
  });

  menuItem.DOM.el.addEventListener("mouseleave", () => {
    // Clear the timeout to avoid triggering the event after leaving the element
    clearTimeout(menuItem.mouseEnterTimeout);
    clearTimeout(menuItem.mouseLeaveTimeout);

    if (menuItem.enterTL) {
      menuItem.enterTL.kill();
    }

    if (mode === "content5") return;

    menuItem.mouseLeaveTimeout = setTimeout(() => {
      menuItem.thumbGrid.DOM.el.classList.remove("thumbgrid--current");

      menuItem.leaveTL = gsap
        .timeline({
          defaults: {
            duration: 0.3,
            ease: "power3",
          },
        })
        .addLabel("start", 0)
        .to(
          menuItem.DOM.title,
          {
            x: 50,
          },
          "start"
        )
        .to(
          menuItem.DOM.description,
          {
            opacity: 0,
            yPercent: 20,
          },
          "start"
        )
        .to(
          menuItem.thumbGrid.DOM.items,
          {
            opacity: 0,
            scale: 0.5,
          },
          "start"
        );
    }, 20);
  });

  // Click event: show content area
  menuItem.DOM.el.addEventListener("click", () => {
    if (isAnimating) return;

    isAnimating = true;
    mode = "content5";

    const DURATION = 0.75;
    const EASE = "expo";
    const THUMBDELAY = "0.02";

    // Clear the timeout to avoid triggering the event after leaving the element
    clearTimeout(menuItem.mouseEnterTimeout);
    clearTimeout(menuItem.mouseLeaveTimeout);

    if (menuItem.enterTL) {
      menuItem.enterTL.kill();
    }
    if (menuItem.leaveTL) {
      menuItem.leaveTL.kill();
    }

    gsap
      .timeline({
        defaults: {
          duration: DURATION,
          ease: EASE,
        },
        onStart: () => {
          menuItem.contentItem.DOM.el.classList.add("content5--current");
        },
        onComplete: () => {
          // Reset values from last hover state

          gsap.set(menuItem.DOM.title, {
            x: 50,
          });
          menuItem.thumbGrid.DOM.el.classList.remove("thumbgrid--current");

          isAnimating = false;
        },
      })
      .addLabel("menu", 0)
      .to(
        menuItem.DOM.titleChars,
        {
          ease: "power4.inOut",
          //stagger: 0.015,
          xPercent: -100,
        },
        "menu"
      )
      .to(
        menuItem.DOM.description,
        {
          ease: "power4.inOut",
          yPercent: -60,
          opacity: 0,
        },
        "menu"
      )
      .add(() => {
        const flipstate = Flip.getState(menuItem.thumbGrid.DOM.items, {
          props: "transform,opacity",
        });

        if (menuItem.enterTL) {
          menuItem.enterTL.progress(1, false);
        }

        [...menuItem.thumbGrid.DOM.items].forEach((item) => {
          menuItem.contentItem.DOM.thumbgrid.appendChild(item);
        });

        Flip.from(flipstate, {
          duration: DURATION,
          ease: "power4.inOut",
          scale: true,
          simple: true,
          prune: true,
          stagger: {
            each: THUMBDELAY,
            from: "end",
          },
        }).add(() => {
          // Show one image rather than the four together
          menuItem.contentItem.DOM.thumbgrid.classList.add(
            "thumbgrid--content5"
          );
        }, DURATION);
      }, "menu")
      .addLabel("content5", "menu+=0.4")
      .to(
        menuItems.map((item) => item.DOM.el),
        {
          opacity: 0,
          onComplete: () => menu.classList.add("menu--hidden"),
        },
        "content5"
      )
      .fromTo(
        menuItem.contentItem.DOM.titleChars,
        {
          xPercent: 100,
        },
        {
          stagger: 0.025,
          xPercent: 0,
        },
        "content5"
      )
      .fromTo(
        [
          menuItem.contentItem.DOM.description,
          menuItem.contentItem.DOM.backCtrl,
        ],
        {
          opacity: 0,
          yPercent: 100,
        },
        {
          opacity: 1,
          yPercent: 0,
        },
        "content5"
      )
      .fromTo(
        [
          menuItem.contentItem.DOM.nextThumb,
          menuItem.contentItem.DOM.prevThumb,
        ],
        {
          scale: 0.9,
          xPercent: (pos) => (pos ? -30 : 30),
          opacity: 0,
        },
        {
          scale: 1,
          xPercent: 0,
          opacity: 1,
        },
        "content5"
      );
  });

  // Back to menu
  menuItem.contentItem.DOM.backCtrl.addEventListener("click", () => {
    if (isAnimating) return;

    isAnimating = true;
    mode = "menu";

    const DURATION = 0.6;
    const EASE = "expo";

    gsap
      .timeline({
        defaults: {
          duration: DURATION,
          ease: EASE,
        },
        onComplete: () => {
          menuItem.contentItem.DOM.el.classList.remove("content5--current");
          menu.classList.remove("menu--hidden");
          isAnimating = false;
        },
      })
      .addLabel("content5", 0)
      .to(
        [
          menuItem.contentItem.DOM.nextThumb,
          menuItem.contentItem.DOM.prevThumb,
        ],
        {
          scale: 0.9,
          xPercent: (pos) => (pos ? -80 : 80),
          opacity: 0,
        },
        "content5"
      )
      .to(
        [
          menuItem.contentItem.DOM.description,
          menuItem.contentItem.DOM.backCtrl,
        ],
        {
          opacity: 0,
          yPercent: -100,
        },
        "content5"
      )
      .to(
        menuItem.contentItem.DOM.titleChars,
        {
          xPercent: 100,
        },
        "content5"
      )
      .add(() => {
        // Show one image rather than the four together
        menuItem.contentItem.DOM.thumbgrid.classList.remove(
          "thumbgrid--content5"
        );

        const thumbgridItems = menuItem.contentItem.DOM.thumbgrid.children;
        const flipstate = Flip.getState(menuItem.thumbGrid.DOM.items, {
          props: "transform,opacity",
        });

        [...thumbgridItems].forEach((item) => {
          menuItem.thumbGrid.DOM.el.appendChild(item);
          gsap.set(item, { opacity: 0 });
        });

        Flip.from(flipstate, {
          duration: DURATION,
          ease: EASE,
          scale: true,
          simple: true,
          prune: true,
        });
      }, "content5")
      .addLabel("menu", "content5+=0.2")
      .to(
        menuItems.map((item) => item.DOM.el),
        {
          opacity: 1,
        },
        "menu"
      )
      .to(
        menuItem.DOM.description,
        {
          yPercent: 0,
        },
        "menu"
      )
      .to(
        menuItem.DOM.titleChars,
        {
          xPercent: 0,
          stagger: -0.02,
        },
        "menu"
      );
  });
}

// Preload images then remove loader (loading class) from body
preloadImages(".thumb-next__inner").then(() =>
  document.body.classList.remove("loading")
);
