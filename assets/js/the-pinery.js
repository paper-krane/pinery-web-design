import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Flip from "gsap/Flip";
import Draggable from "gsap/Draggable";
import ASScroll from "https://cdn.skypack.dev/@ashthornton/asscroll"

gsap.registerPlugin(ScrollTrigger, Draggable, Flip);

class ThePinery {
    constructor() {
        this.init();
    }

    init() {
        console.log('The Pinery website has initialized...');

        this.smoothScroll();

        window.addEventListener("load", () => {
            this.homeGallery();
            this.homeVideoBanner();
            this.homeVideoBannerImageParallax();
            this.homeVideoBannerModal();
            this.homeServices();
            this.homeSocialGrid();
        });
    }

    smoothScroll() {
        const asscroll = new ASScroll({
            disableRaf: true,
            ease: .0625
        });

        gsap.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement
        });

        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                return arguments.length ? asscroll.currentPos = value : asscroll.currentPos;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
            }
        });
        
        asscroll.on("update", ScrollTrigger.update);

        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        window.addEventListener("load", () => {
            asscroll.enable();
        });
    }

    homeGallery() {
        const galleryEl = document.querySelector('#the-pinery__gallery');

        if (!galleryEl) return;

        const gallery = gsap.to("#the-pinery__gallery", {
            duration: 100,
            ease: "none",
            x: `-50%`,
            repeat: -1,
        });

        ScrollTrigger.create({
            trigger: "#the-pinery__hero",
            start: "top top",
            end: "bottom top",
            onUpdate(self) {
                const velocity = self.getVelocity();
                if (velocity < 0) return;
                const timeScale = 3 + (velocity / 30);
                gsap.timeline()
                    .to(gallery, { duration: 0.25, timeScale })
                    .to(gallery, { duration: .5, timeScale: 1 });
            }
          });
    }

    homeVideoBanner() {
        const videoBannerEl = document.querySelector('#the-pinery__video-banner');
        const videoToggle = document.querySelector('.the-pinery__video-modal-toggle-container');

        if (!videoBannerEl || !videoToggle) return;

        const buttonRotate = gsap.to('.the-pinery__video-modal-toggle-container .bg', {
            rotate: '360deg',
            duration: 10,
            repeat: -1,
            ease: 'none'
        })

        videoBannerEl.addEventListener('mousemove', (e) => {
            const pos = {
                x: e.offsetX,
                y: e.offsetY
            }

            gsap.to(videoToggle, {
                duration: 1,
                left: pos.x,
                top: pos.y,
                ease: 'expo'
            });
        });

        videoBannerEl.addEventListener('mouseleave', (e) => {
            gsap.to(videoToggle, {
                duration: 1,
                left: '50%',
                top: '50%'
            });
        });
    }

    homeVideoBannerModal() {
        const videoModalEl = document.querySelector('#the-pinery__video-modal');
        const videoToggle = document.querySelector('#the-pinery__video-banner');
        const videoToggleClose = document.querySelector('#the-pinery__video-modal-close');

        if (!videoModalEl || !videoToggle) return;

        videoToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const modalAnimation = gsap.timeline();
            modalAnimation.to(videoModalEl, {
                display: 'none',
                top: videoToggle.getBoundingClientRect().top,
                left: videoToggle.getBoundingClientRect().left,
                duration: 0,
                opacity: 0,
                height: `${videoToggle.offsetHeight}px`,
                width: `${videoToggle.offsetWidth}px`,
                zIndex: 0
            });
            modalAnimation.to(videoModalEl, {
                display: 'block',
                opacity: 1,
                top: 0,
                left: 0,
                zIndex: 99,
                duration: 1.2,
                height: '100vh',
                width: '100%',
                ease: "power4.out",
                onComplete:() => {
                    document.querySelector('#the-pinery__promo').play();
                }
            })
        });

        videoToggleClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            document.querySelector('#the-pinery__promo').pause();

            const modalAnimation = gsap.timeline();
            modalAnimation.to(videoModalEl, {
                display: 'none',
                duration: .5,
                opacity: 0,
                onComplete: () => {
                    
                }
            });
        });
    }

    homeVideoBannerImageParallax() {
        let mm = gsap.matchMedia();

        // mm.add({
        //     isMobile: 'max-width: 1279.5px',
        //     isDesktop: 'min-width: 1280px',
        //     reducedMotion: 'prefers-reduced-motion: reduce'
        // }, (context) => {
        //     let {isMobile, isDesktop,} = context.conditions;

        // });

        const paraImage = gsap.to("#the-pinery__floating-image-container", {
            y: () => {
                if (window.innerWidth > 1280) {
                    return 42;
                } else {
                    return 0;
                }
            },
            ease: "power1",
            scrollTrigger: {
              trigger: "#the-pinery__video-banner-container",
              scrub: 3
            }, 
        });

        const scaleImage = gsap.to("#the-pinery__floating-image", {
            scale: 1,
            ease: "power1",
            scrollTrigger: {
              trigger: "#the-pinery__video-banner-container",
              scrub: 3
            }, 
        });
    }

    homeServices() {
        const services = document.querySelectorAll('#the-pinery__services a[data-controls]');

        if (services.length < 1) return;
        
        for (let service of services) {
            service.addEventListener('mouseenter', (e) => {
                const controls = e.target.dataset.controls;
                const slide = document.querySelector(`#the-pinery__services-slides .the-pinery__slide[data-slide="${controls}"]`);
                const currentActive = document.querySelector(`#the-pinery__services-slides .the-pinery__slide.active`);

                if (slide.classList.contains('active')) return;

                currentActive.classList.remove('active');
                slide.classList.add('active');
            });
        }
    }

    homeSocialGrid() {
        const paraImage = gsap.to(".the-pinery__grid", {
            y: () => {
                if (window.innerWidth > 1280) {
                    return -128;
                } else {
                    return 0;
                }
            },
            scale: 1.05,
            ease: "power1",
            scrollTrigger: {
              trigger: "#the-pinery__social-grid-container",
              scrub: 3
            }, 
        });
    }
}

const thepinery = new ThePinery;