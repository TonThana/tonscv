import getRandomFloat from "../cosmicBackground/utils/getRandomFloat";
import charming from 'charming'
import anime from 'animejs'

export const getMousePos = (e) => {
    let posx = 0;
    let posy = 0;
    if (!e) e = window.event;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return { x: posx, y: posy }
}

class HoverImgFx11 {
    constructor(el) {
        this.DOM = { el: el }
        this.DOM.reveal = document.createElement("div")
        this.DOM.reveal.className = "hover-reveal"
        this.DOM.reveal.innerHTML = `<div class="hover-reveal__deco"></div><div class="hover-reveal__inner"><div class="hover-reveal__img"></div></div>`
        this.DOM.el.appendChild(this.DOM.reveal)
        this.DOM.revealInner = this.DOM.reveal.querySelector('.hover-reveal__inner');
        this.DOM.revealInner.style.overflow = 'hidden';
        this.DOM.revealDeco = this.DOM.reveal.querySelector('.hover-reveal__deco');
        this.DOM.revealDeco.style.backgroundColor = "rgb(0,0,0)"
        this.DOM.revealDeco.style.left = "50%"
        this.DOM.revealDeco.style.width = "1%"
        this.DOM.revealDeco.style.height = "100%"
        this.DOM.revealImg = this.DOM.revealInner.querySelector('.hover-reveal__img');
        // console.log(this.DOM.el.dataset.img)
        // this.DOM.revealImg.classList.add(`${this.DOM.el.dataset.img}`)
        charming(this.DOM.el);
        this.DOM.letters = [...this.DOM.el.querySelectorAll('span')];

        this.initEvents()

    }

    initEvents() {
        this.positionElement = ev => {
            const mousePos = getMousePos(ev)
            const docScrolls = {
                left: document.body.scrollLeft + document.documentElement.scrollLeft,
                top: document.body.scrollTop + document.documentElement.scrollTop
            }
            // pos of el !!
            this.DOM.reveal.style.top = `${mousePos.y + 20 - docScrolls.top}px`
            this.DOM.reveal.style.left = `${mousePos.x - this.DOM.el.dataset.xpos - docScrolls.left}px`;

        }
        this.mouseenterFn = (ev) => {
            this.positionElement(ev);
            this.showImage();
            this.animateLetters();
        };
        this.mousemoveFn = ev => requestAnimationFrame(() => {
            this.positionElement(ev);
        });
        this.mouseleaveFn = () => {
            this.hideImage();
        };
        this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
        this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
        this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
    }


    showImage() {
        this.DOM.revealImg.classList.add(`${this.DOM.el.dataset.img}`)

        anime.remove(this.DOM.reveal)
        anime.remove(this.DOM.revealInner)
        anime.remove(this.DOM.revealImg)
        anime.remove(this.DOM.revealDeco)
        this.DOM.reveal.style.opacity = 1;
        this.DOM.el.style.zIndex = 1000
        this.DOM.revealInner.style.transform = "translateY(100%)"
        this.DOM.revealDeco.style.transformOrigin = "50% 100%"
        this.tl = anime.timeline({})
        this.tl.add({
            targets: this.DOM.revealDeco,
            scaleX: [10, 1],
            scaleY: [0, 1],
            duration: 300,
            easing: "easeInOutSine",
            complete: () => {
                this.DOM.revealDeco.style.transformOrigin = "50% 0%"
            }
        }, 0).add({
            targets: this.DOM.revealDeco,
            easing: "easeOutExpo",
            scaleY: 0,
            duration: 300
        }, 300).add({
            targets: this.DOM.revealInner,
            duration: 500,
            translateY: ["100%", "0%"],
            easing: "easeOutExpo",
        }, 400).add({
            duration: 500,
            targets: this.DOM.revealImg,
            translateY: ["-100%", "0%"],
            easing: "easeOutExpo",
        }, 400).add({
            duration: 500,
            targets: this.DOM.revealImg,
            translateY: ["100%", "0%"],
            easing: "easeOutExpo",
        }, 400).add({
            duration: 1100,
            targets: this.DOM.reveal,
            translateY: ["50%", "0%"],
            rotate: [10, 0],
            easing: "easeOutExpo",
        }, 300)

    }

    hideImage() {

        anime.remove(this.DOM.reveal)
        anime.remove(this.DOM.revealInner)
        anime.remove(this.DOM.revealImg)
        anime.remove(this.DOM.revealDeco)
        this.tl = anime.timeline({
            // begin: () => this.DOM.el.style.zIndex = 999,
        })
        this.tl.add({
            targets: this.DOM.revealInner,
            duration: 500,
            easing: "easeOutSine",
            translateY: "-100%"
        }, 0).add({
            targets: this.DOM.revealImg,
            duration: 500,
            easing: "easeOutSine",
            translateY: "100%",
            complete: () => {
                this.DOM.el.style.zIndex = ''
                this.DOM.reveal.style.opacity = 0
                this.DOM.revealImg.classList.remove(`${this.DOM.el.dataset.img}`)
            },
        }, 0)
    }
    animateLetters() {

        anime.remove(this.DOM.letters)
        anime({
            targets: this.DOM.letters,
            delay: anime.stagger(30),
            translateY: ["30%", "0%"],
            easing: "easeOutExpo",
            opacity: [0, 1],
            duration: 100
        })

    }
}



class HoverImgFx3 {
    constructor(el) {
        this.DOM = { el: el }
        this.DOM.reveal = document.createElement('div');
        this.DOM.reveal.className = 'hover-reveal';
        this.DOM.reveal.style.overflow = 'hidden';
        this.DOM.reveal.innerHTML = `<div class="hover-reveal__inner"><div class="hover-reveal__img"></div></div>`;
        this.DOM.el.appendChild(this.DOM.reveal);
        this.DOM.revealInner = this.DOM.reveal.querySelector('.hover-reveal__inner');
        this.DOM.revealInner.style.overflow = 'hidden';
        this.DOM.revealImg = this.DOM.revealInner.querySelector('.hover-reveal__img');
        charming(this.DOM.el);
        this.DOM.letters = [...this.DOM.el.querySelectorAll('span')];
        this.initEvents();
    }
    initEvents() {

        this.positionElement = ev => {
            const mousePos = getMousePos(ev)
            const docScrolls = {
                left: document.body.scrollLeft + document.documentElement.scrollLeft,
                top: document.body.scrollTop + document.documentElement.scrollTop
            }
            // pos of el !!
            this.DOM.reveal.style.top = `${mousePos.y + 20 - docScrolls.top}px`
            this.DOM.reveal.style.left = `${mousePos.x - this.DOM.el.dataset.xpos - docScrolls.left}px`;
        }
        this.mouseenterFn = (ev) => {
            this.positionElement(ev);
            this.showImage();
            this.animateLetters();
        };
        this.mousemoveFn = ev => requestAnimationFrame(() => {
            this.positionElement(ev);
        });
        this.mouseleaveFn = () => {
            this.hideImage();
        };
        this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
        this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
        this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
    }
    showImage() {
        this.DOM.revealImg.classList.add(`${this.DOM.el.dataset.img}`)
        anime.remove(this.DOM.revealInner)
        anime.remove(this.DOM.revealImg)

        this.tl = anime.timeline({
            begin: () => {
                this.DOM.reveal.style.opacity = 1;
                this.DOM.el.style.zIndex = 1000
                this.DOM.revealInner.style.transformOrigin = "50% 100%"
                this.DOM.revealImg.style.transformOrigin = "50% 100%"
            }
        })
        this.tl.add({
            targets: this.DOM.revealInner,
            duration: 400,
            easing: "easeOutExpo",
            translateX: ["50%", "0%"],
            translateY: ["120%", "0%"],
            rotate: [50, 0]
        }, 0).add({
            targets: this.DOM.revealImg,
            duration: 400,
            easing: "easeOutExpo",
            translateX: ["-50%", "0%"],
            translateY: ["-120%", "0%"],
            rotate: [-50, 0],
            scale: { value: [2, 1], duration: 800 }
        }, 0)
    }
    hideImage() {

        anime.remove(this.DOM.revealInner)
        anime.remove(this.DOM.revealImg)
        this.tl = anime.timeline({
            begin: () => {
                this.DOM.el.style.zIndex = 999
            },

        }).add({
            targets: this.DOM.revealInner,
            duration: 3000,
            easing: "easeOutExpo",
            translateY: "-120%",
            rotate: -5
        }, 0).add({
            duration: 3000,
            targets: this.DOM.revealImg,
            translateY: "-120%",
            rotation: "5",
            scale: 1.2,
            complete: () => {
                this.DOM.el.style.zIndex = ''
                this.DOM.reveal.style.opacity = 0;
                this.DOM.revealImg.classList.remove(`${this.DOM.el.dataset.img}`)
            }
        }, 0)
    }

    animateLetters() {
        anime.remove(this.DOM.letters)
        anime({
            targets: this.DOM.letters,
            delay: anime.stagger(30),
            easing: "easeOutExpo",
            opacity: [0, 1],
            translateX: ["100%", "0%"],
            duration: 200
        })
    }

}


// multiple image DOM (not continuous)
class HoverImgFx14 {
    constructor(el) {
        this.DOM = { el }
        this.DOM.reveal = document.createElement('div');
        this.DOM.reveal.className = 'hover-reveal';
        let inner = '';
        const imgsArr = this.DOM.el.dataset.img.split(',');
        for (let i = 0, len = imgsArr.length; i <= len - 1; ++i) {
            console.log(imgsArr[i])
            inner += `<div class="hover-reveal__img ${imgsArr[i]}" style="transform-origin:top right;opacity:0;position:absolute;"></div>`;
        }
        this.DOM.reveal.innerHTML = inner;
        this.DOM.el.appendChild(this.DOM.reveal);
        this.DOM.revealImgs = [...this.DOM.reveal.querySelectorAll('.hover-reveal__img')];
        console.log(this.DOM.revealImgs)
        this.imgsTotal = this.DOM.revealImgs.length;

        this.initEvents();
    }


    initEvents() {
        this.positionElement = (ev) => {
            const mousePos = getMousePos(ev);
            const docScrolls = {
                left: document.body.scrollLeft + document.documentElement.scrollLeft,
                top: document.body.scrollTop + document.documentElement.scrollTop
            };
            // pos of el !!
            this.DOM.reveal.style.top = `${mousePos.y + 20 - docScrolls.top}px`
            this.DOM.reveal.style.left = `${mousePos.x - this.DOM.el.dataset.xpos - docScrolls.left}px`
        };
        this.mouseenterFn = (ev) => {
            this.positionElement(ev);
            this.showImage();
        };
        this.mousemoveFn = ev => requestAnimationFrame(() => {
            this.positionElement(ev);
        });
        this.mouseleaveFn = () => {
            this.hideImage();
        };

        this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
        this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
        this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
    }

    showImage() {
        this.DOM.reveal.style.opacity = 1;
        this.DOM.el.style.zIndex = 1000
        this.DOM.revealImgs.forEach(el => {
            el.style.opacity = 0;
        })
        const show = () => {
            anime.remove(this.DOM.revealImgs[this.current])
            this.DOM.revealImgs[this.current].style.zIndex = 1000
            anime({
                targets: this.DOM.revealImgs[this.current],
                duration: 400,
                easing: "easeOutQuint",
                opacity: [0, 1],
                translateY: ["-10%", "0%"],
                rotate: [-15, 0],
                scale: [0.5, 1]
            })
        }
        this.current = 0
        show()

        const loop = () => {
            this.imgtimeout = setTimeout(() => {
                this.DOM.revealImgs[this.current].style.zIndex = '';
                anime({
                    targets: this.DOM.revealImgs[this.current],
                    duration: 800,
                    easing: "easeOutExpo",
                    translateX: `${getRandomFloat(-10, 10)}%`,
                    translateY: `${getRandomFloat(10, 60)}%`,
                    rotate: getRandomFloat(5, 15),
                    opacity: 0
                })
                this.current = this.current < this.imgsTotal - 1 ? this.current + 1 : 0
                show();
                loop();
            }, 500)
        }
        loop()
    }
    hideImage() {
        clearTimeout(this.imgtimeout)
        this.DOM.revealImgs[this.current].style.zIndex = '';
        this.DOM.revealImgs[this.current].style.opacity = 0;
        this.current = 0
        this.DOM.el.style.zIndex = ''
        this.DOM.reveal.style.opacity = 0
    }
}

class HoverImgFx6 {
    constructor(el) {
        this.DOM = { el: el };

        this.DOM.reveal = document.createElement('div');
        this.DOM.reveal.className = 'hover-reveal';
        this.DOM.reveal.style.overflow = 'hidden';
        this.DOM.reveal.innerHTML = `<div class="hover-reveal__deco"></div><div class="hover-reveal__inner"><div class="hover-reveal__img"></div></div>`;
        this.DOM.el.appendChild(this.DOM.reveal);
        this.DOM.revealInner = this.DOM.reveal.querySelector('.hover-reveal__inner');
        this.DOM.revealInner.style.overflow = 'hidden';
        this.DOM.revealDeco = this.DOM.reveal.querySelector('.hover-reveal__deco');
        this.DOM.revealImg = this.DOM.revealInner.querySelector('.hover-reveal__img');

        this.initEvents();
    }


    initEvents() {
        this.positionElement = ev => {
            const mousePos = getMousePos(ev)
            const docScrolls = {
                left: document.body.scrollLeft + document.documentElement.scrollLeft,
                top: document.body.scrollTop + document.documentElement.scrollTop
            }

            // pos of el !!
            this.DOM.reveal.style.top = `${mousePos.y - this.DOM.el.dataset.ypos - docScrolls.top}px`
            this.DOM.reveal.style.left = `${mousePos.x - this.DOM.el.dataset.xpos - docScrolls.left}px`;

        }
        this.mouseenterFn = (ev) => {
            this.positionElement(ev);
            this.showImage();

        };
        this.mousemoveFn = ev => requestAnimationFrame(() => {
            this.positionElement(ev);
        });
        this.mouseleaveFn = () => {
            this.hideImage();
        };
        this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
        this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
        this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
    }

    showImage() {
        this.DOM.revealImg.classList.add(`${this.DOM.el.dataset.img}`)

        anime.remove(this.DOM.reveal)
        anime.remove(this.DOM.revealInner)
        anime.remove(this.DOM.revealImg)
        anime.remove(this.DOM.revealDeco)

        const tl = anime.timeline({
            begin: () => {
                this.DOM.reveal.style.opacity = 1;
                this.DOM.el.style.zIndex = 1000
                this.DOM.revealInner.style.transform = "translateX(100%)"
                this.DOM.revealDeco.style.transformOrigin = "100% 50%"

            },
        })
        tl.add({
            targets: this.DOM.revealDeco,
            duration: 300,
            easing: "easeInOutSine",
            scaleX: [0, 1],
            complete: () => {
                this.DOM.revealDeco.style.transformOrigin = "0% 50%"
            }
        }, 0).add({
            targets: this.DOM.revealDeco,
            duration: 600,
            easing: "easeOutExpo",
            scaleX: 0
        }, 300).add({
            targets: this.DOM.revealInner,
            duration: 600,
            easing: "easeOutExpo",
            translateX: ["100%", "0%"]
        }, 450).add({
            targets: this.DOM.revealImg,
            duration: 600,
            easing: "easeOutExpo",
        }, 450).add({
            targets: this.DOM.revealImg,
            duration: 1600,
            easing: "easeOutExpo",
            scale: [1.3, 1],
        }, 450).add({
            targets: this.DOM.reveal,
            duration: 800,
            easing: "easeOutQuint",
            translateX: ["20%", "0%"],
            rotate: [10, 0]
        }, 0)

    }

    hideImage() {
        anime.remove(this.DOM.reveal)
        anime.remove(this.DOM.revealInner)
        anime.remove(this.DOM.revealImg)
        anime.remove(this.DOM.revealDeco)
        this.tl = anime.timeline({
            begin: () => this.DOM.el.style.zIndex = 999,
        })
        this.tl.add({
            targets: this.DOM.revealInner,
            duration: 200,
            easing: "easeOutSine",
            translateX: "-200%"
        }, 0).add({
            targets: this.DOM.revealImg,
            duration: 100,
            easing: "easeOutSine",
            // translateX: "100%",
            complete: () => {
                this.DOM.el.style.zIndex = ''
                this.DOM.reveal.style.opacity = 0

                this.DOM.revealImg.classList.remove(`${this.DOM.el.dataset.img}`)
            },
        }, 0)
    }
}

class HoverImgFx1 {
    constructor(el) {
        this.DOM = { el }
        this.DOM.reveal = document.createElement("div")
        this.DOM.reveal.className = "hover-reveal"
        this.DOM.reveal.innerHTML = `<div class="hover-reveal__inner"><div class="hover-reveal__img"></div></div>`
        this.DOM.el.appendChild(this.DOM.reveal)
        this.DOM.revealInner = this.DOM.reveal.querySelector('.hover-reveal__inner')
        this.DOM.revealInner.style.overflow = "hidden"
        this.DOM.revealImg = this.DOM.revealInner.querySelector(".hover-reveal__img");
        this.initEvents()
    }
    initEvents() {
        this.positionElement = ev => {
            const mousePos = getMousePos(ev)
            const docScrolls = {
                left: document.body.scrollLeft + document.documentElement.scrollLeft,
                top: document.body.scrollTop + document.documentElement.scrollTop
            }
            // pos of el !!
            this.DOM.reveal.style.top = `${mousePos.y - this.DOM.el.dataset.ypos - docScrolls.top}px`
            this.DOM.reveal.style.left = `${mousePos.x - this.DOM.el.dataset.xpos - docScrolls.left}px`;
        }
        this.mouseenterFn = (ev) => {
            this.positionElement(ev);
            this.showImage();
        };
        this.mousemoveFn = ev => requestAnimationFrame(() => {
            this.positionElement(ev);
        });
        this.mouseleaveFn = () => {
            this.hideImage();
        };
        this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
        this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
        this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
    }

    showImage() {
        this.DOM.revealImg.classList.add(`${this.DOM.el.dataset.img}`)
        anime.remove(this.DOM.revealInner)
        anime.remove(this.DOM.revealImg)
        this.tl = anime.timeline({
            begin: () => {
                this.DOM.reveal.style.opacity = 1
                this.DOM.el.style.zIndex = 1000

            }
        }).add({
            targets: this.DOM.revealInner,
            duration: 200,
            easing: "easeOutSine",
            translateX: ["-100%", "0%"]
        }, 0).add({
            targets: this.DOM.revealImg,
            duration: 200,
            easing: "easeOutSine",
            translateX: ["100%", "0%"]
        }, 0)
    }
    hideImage() {

        anime.remove(this.DOM.revealInner)
        anime.remove(this.DOM.revealImg)
        this.tl = anime.timeline({
            begin: () => this.DOM.el.style.zIndex = 999,
        })
        this.tl.add({
            targets: this.DOM.revealInner,
            duration: 200,
            easing: "easeOutSine",
            translateX: "100%"
        }, 0).add({
            targets: this.DOM.revealImg,
            duration: 200,
            easing: "easeOutSine",
            translateX: "-100%",
            complete: () => {
                this.DOM.el.style.zIndex = ''
                this.DOM.reveal.style.opacity = 0
                this.DOM.revealImg.classList.remove(`${this.DOM.el.dataset.img}`)
            },
        }, 0)
    }
}

class HoverImgFx7 {
    constructor(el) {
        this.DOM = { el }
        this.DOM.reveal = document.createElement('div');
        this.DOM.reveal.className = 'hover-reveal';
        this.DOM.reveal.innerHTML = `<div class="hover-reveal__deco"></div><div class="hover-reveal__inner"><div class="hover-reveal__img"></div></div>`;
        this.DOM.el.appendChild(this.DOM.reveal);
        this.DOM.revealInner = this.DOM.reveal.querySelector('.hover-reveal__inner');
        this.DOM.revealDeco = this.DOM.reveal.querySelector('.hover-reveal__deco');
        this.DOM.revealImg = this.DOM.revealInner.querySelector('.hover-reveal__img');
        charming(this.DOM.el);
        this.DOM.letters = [...this.DOM.el.querySelectorAll('span')];
        this.initEvents();
    }

    initEvents() {
        this.positionElement = ev => {
            const mousePos = getMousePos(ev)
            const docScrolls = {
                left: document.body.scrollLeft + document.documentElement.scrollLeft,
                top: document.body.scrollTop + document.documentElement.scrollTop
            }
            // pos of el !!
            this.DOM.reveal.style.top = `${mousePos.y - this.DOM.el.dataset.ypos - docScrolls.top}px`
            this.DOM.reveal.style.left = `${mousePos.x - this.DOM.el.dataset.xpos - docScrolls.left}px`;
        }
        this.mouseenterFn = (ev) => {
            this.positionElement(ev);
            this.showImage();
            this.animateLetters();
        };
        this.mousemoveFn = ev => requestAnimationFrame(() => {
            this.positionElement(ev);
        });
        this.mouseleaveFn = () => {
            this.hideImage();
        };
        this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
        this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
        this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
        window.addEventListener('resize', () => this.rect = this.DOM.reveal.getBoundingClientRect())
    }

    showImage() {
        this.DOM.revealImg.classList.add(`${this.DOM.el.dataset.img}`)
        anime.remove(this.DOM.reveal)
        anime.remove(this.DOM.revealInner)
        anime.remove(this.DOM.revealImg)
        anime.remove(this.DOM.revealDeco)
        this.tl = anime.timeline({
            begin: () => {
                this.DOM.reveal.style.opacity = 1;
                this.DOM.el.style.zIndex = 1000;
                this.DOM.revealInner.style.opacity = 0;
                this.DOM.revealDeco.style.transformOrigin = "-5% 50%"
            }
        }).add({
            targets: this.DOM.revealDeco,
            duration: 200,
            easing: "easeInOutQuad",
            scaleY: 0.8,
            scaleX: 1,
            complete: () => this.DOM.revealDeco.style.transformOrigin = "105% 50%"
        }, 0).add({
            targets: this.DOM.revealDeco,
            duration: 300,
            easing: "easeOutSine",
            scaleX: 0,
            scaleY: 1
        }, 200).add({
            targets: this.DOM.revealInner,
            duration: 900,
            easing: "easeOutElastic",
            scale: [0, 1],
            opacity: 1,
            translateX: "0%"
        }, 400).add({
            targets: this.DOM.revealImg,
            duration: 800,
            easing: "easeOutExpo",
            rotate: -15,
        }, 0).add({
            targets: this.DOM.reveal,
            duration: 1000,
            easing: "easeOutQuint",
            translateX: ["-50%", "0%"],
            translateY: ["10%", "0%"],
            rotate: [-35, 15]
        }, 0)
    }

    hideImage() {
        // this.DOM.revealImg.classList.remove(`${this.DOM.el.dataset.img}`)
        anime.remove(this.DOM.reveal);
        anime.remove(this.DOM.revealInner);
        anime.remove(this.DOM.revealImg);
        anime.remove(this.DOM.revealDeco);

        this.tl = anime.timeline({
            begin: () => this.DOM.el.style.zIndex = 999,
        })
        this.tl.add({
            targets: this.DOM.revealInner,
            duration: 1300,
            easing: "easeOutSine",
            scale: 0.8,
            opacity: 0,
            complete: () => {
                this.DOM.el.style.zIndex = ''
                this.DOM.reveal.style.opacity = 0
                this.DOM.revealImg.classList.remove(`${this.DOM.el.dataset.img}`)
            },
        }, 0)
    }

    animateLetters() {
        anime.remove(this.DOM.letters)
        anime({
            targets: this.DOM.letters,
            delay: anime.stagger(20),
            easing: "easeOutElastic",
            opacity: [0, 1],
            translateY: ["50%", "0%"],
            duration: 800
        })
    }
}


[...document.querySelectorAll('[data-fx="11"] > a, a[data-fx="11"]')].forEach(link => new HoverImgFx11(link));
[...document.querySelectorAll('[data-fx="3"] > a, a[data-fx="3"]')].forEach(link => new HoverImgFx3(link));
[...document.querySelectorAll('[data-fx="14"] > a, a[data-fx="14"]')].forEach(link => new HoverImgFx14(link));
[...document.querySelectorAll('[data-fx="6"] > a, a[data-fx="6"]')].forEach(link => new HoverImgFx6(link));
[...document.querySelectorAll('[data-fx="1"] > a, a[data-fx="1"]')].forEach(link => new HoverImgFx1(link));
[...document.querySelectorAll('[data-fx="7"] > a, a[data-fx="7"]')].forEach(link => new HoverImgFx7(link));
