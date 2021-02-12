import anime from 'animejs/lib/anime.es'
import { dynamicBezierAnimation } from "./DynamicBezier/DynamicBezier";


const initialPaths = [
    "m 189 80.37 c 54 -14.25 118.3 6.91 161.9 43.73 c 38.4 32.5 66.1 87.1 67.2 139.3 c 1 42.3 -16.3 92.2 -49.6 115.7 c -69.7 48.9 -189.3 67.3 -250.9 7.2 c -52.2 -51 -39.05 -156 -12.1 -225.8 c 14.2 -36.9 47.1 -70.65 83.5 -80.13 z",
    "m 378.1 121.2 c 30.3 28.8 39.1 76.7 32.9 124.6 c -6.2 47.9 -27.5 95.9 -57.6 124.9 c -50.2 48.4 -154.7 57 -208.9 13.1 c -58.32 -47.3 -77.37 -162.5 -32.6 -222.8 c 26.7 -36 77 -61.38 128.8 -70.08 c 51.7 -8.68 104.9 -0.6 137.4 30.28 z",
    "m 280.1 34.42 c 185.7 -4.53 234.5 319.58 137.2 357.88 c -98.4 30.9 -85 -277.6 -184 -248.7 c -99.3 29 61 246.9 -21.3 309.6 c -37.2 28.4 -105.7 6.4 -137.46 -27.9 c -53.32 -57.6 -44.41 -180.6 -28.91 -233.7 c 14.32 -49.2 49.69 -86.6 89.57 -113.71 c 41.7 -28.37 94.7 -47.93 144.9 -43.47 z",
    "m 274.4 32.13 c 54.1 4.15 -25.4 107.57 13.3 160.67 c 38.6 53.1 195.6 55.6 171.3 102.2 c -24.1 46.2 -117.6 -27.4 -161 2.5 c -50.6 34.8 -2 163.9 -64.1 170.3 c -56.7 6 -19.7 -141.5 -57.9 -199.5 c -38.2 -57.8 -151.61 -25.9 -136.11 -79 c 14.32 -49.2 102.11 -30.4 144.71 -60.1 c 36.5 -25.3 44.7 -100.52 89.8 -97.07 z"
]

class ImgItem {
    constructor(el, index) {
        this.DOM = {};
        this.DOM.el = el;
        this.index = index
        this.DOM.svg = this.DOM.el.querySelector('.item__svg');
        this.DOM.path = this.DOM.svg.querySelector('path');
        this.paths = {};
        this.paths.start = initialPaths[index];
        this.paths.end = this.DOM.el.dataset.morphPath;
        // console.log("start", this.paths.start)
        // console.log("end", this.paths.end)

        this.DOM.deco = this.DOM.svg.querySelector('.item__deco');
        this.DOM.image = this.DOM.svg.querySelector('image');
        this.DOM.title = this.DOM.el.querySelector('.item__meta > .item__title');
        this.DOM.subtitle = this.DOM.el.querySelector('.item__meta > .item__subtitle');
        this.CONFIG = {
            // Defaults:
            animation: {
                path: {
                    duration: this.DOM.el.dataset.animationPathDuration || 1500,
                    delay: this.DOM.el.dataset.animationPathDelay || 0,
                    easing: this.DOM.el.dataset.animationPathEasing || 'easeOutElastic',
                    elasticity: this.DOM.el.dataset.pathElasticity || 400,
                    scaleX: this.DOM.el.dataset.pathScalex || 1,
                    scaleY: this.DOM.el.dataset.pathScaley || 1,
                    translateX: this.DOM.el.dataset.pathTranslatex || 0,
                    translateY: this.DOM.el.dataset.pathTranslatey || 0,
                    rotate: this.DOM.el.dataset.pathRotate || 0
                },
                image: {
                    duration: this.DOM.el.dataset.animationImageDuration || 2000,
                    delay: this.DOM.el.dataset.animationImageDelay || 0,
                    easing: this.DOM.el.dataset.animationImageEasing || 'easeOutElastic',
                    elasticity: this.DOM.el.dataset.imageElasticity || 400,
                    scaleX: this.DOM.el.dataset.imageScalex || 1.1,
                    scaleY: this.DOM.el.dataset.imageScaley || 1.1,
                    translateX: this.DOM.el.dataset.imageTranslatex || 0,
                    translateY: this.DOM.el.dataset.imageTranslatey || 0,
                    rotate: this.DOM.el.dataset.imageRotate || 0
                },
                deco: {
                    duration: this.DOM.el.dataset.animationDecoDuration || 2500,
                    delay: this.DOM.el.dataset.animationDecoDelay || 0,
                    easing: this.DOM.el.dataset.animationDecoEasing || 'easeOutQuad',
                    elasticity: this.DOM.el.dataset.decoElasticity || 400,
                    scaleX: this.DOM.el.dataset.decoScalex || 0.9,
                    scaleY: this.DOM.el.dataset.decoScaley || 0.9,
                    translateX: this.DOM.el.dataset.decoTranslatex || 0,
                    translateY: this.DOM.el.dataset.decoTranslatey || 0,
                    rotate: this.DOM.el.dataset.decoRotate || 0
                }
            }
        };
        this.initEvents();
    }
    initEvents() {
        this.mouseenterFn = () => {
            this.mouseTimeout = setTimeout(() => {
                this.isActive = true;
                this.animate();
            }, 75);
        }
        this.mouseleaveFn = () => {
            clearTimeout(this.mouseTimeout);
            if (this.isActive) {
                this.isActive = false;
                this.animate();
            }
        }
        this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
        this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
        this.DOM.el.addEventListener('touchstart', this.mouseenterFn);
        this.DOM.el.addEventListener('touchend', this.mouseleaveFn);
    }
    getAnimeObj(targetStr) {
        const target = this.DOM[targetStr];
        let animeOpts = {
            targets: target,
            duration: this.CONFIG.animation[targetStr].duration,
            delay: this.CONFIG.animation[targetStr].delay,
            easing: this.CONFIG.animation[targetStr].easing,
            elasticity: this.CONFIG.animation[targetStr].elasticity,
            scaleX: this.isActive ? this.CONFIG.animation[targetStr].scaleX : 1,
            scaleY: this.isActive ? this.CONFIG.animation[targetStr].scaleY : 1,
            translateX: this.isActive ? this.CONFIG.animation[targetStr].translateX : 0,
            translateY: this.isActive ? this.CONFIG.animation[targetStr].translateY : 0,
            rotate: this.isActive ? this.CONFIG.animation[targetStr].rotate : 0
        };
        if (targetStr === 'path') {
            animeOpts.d = this.isActive ? this.paths.end : this.paths.start
        }
        anime.remove(target);
        return animeOpts;
    }
    animate() {
        // Animate the path, the image and deco.
        anime(this.getAnimeObj('path'));
        anime(this.getAnimeObj('image'));
        anime(this.getAnimeObj('deco'));
        // Title and Subtitle animation
        anime.remove(this.DOM.title);
        const bgColor = this.isActive ? "#FFF000" : "#fee12b"

        anime({
            targets: this.DOM.title,
            easing: 'easeOutQuad',
            translateY: this.isActive ? [
                { value: '-50%', duration: 200 },
                { value: ['50%', '0%'], duration: 200 }
            ] : [
                    { value: '50%', duration: 200 },
                    { value: ['-50%', '0%'], duration: 200 }
                ],
            opacity: [
                { value: 0, duration: 200 },
                { value: 1, duration: 200 }
            ],
            backgroundColor: bgColor
        });
        anime.remove(this.DOM.subtitle);
        anime({
            targets: this.DOM.subtitle,
            easing: 'easeOutQuad',
            translateY: this.isActive ? { value: ['50%', '0%'], duration: 200, delay: 250 } : { value: '0%', duration: 1 },
            opacity: this.isActive ? { value: [0, 1], duration: 200, delay: 250 } : { value: 0, duration: 1 },
            backgroundColor: "#F6F2CA",

        });


        // // the lines 
        // if (this.isActive) {
        //     console.log(this.index)
        //     const start = this.DOM.el

        //     for (let i = 0; i < items.length; i += 1) {
        //         if (i === this.index) {

        //         } else {
        //             const end = items[i]
        //             console.log(end)
        //             dynamicBezierAnimation(start, end)
        //         }
        //     }


        // }

    }
}

const items = Array.from(document.querySelectorAll('.item'));

export const staticBlobInit = () => items.forEach((item, i) => {
    new ImgItem(item, i);
});


