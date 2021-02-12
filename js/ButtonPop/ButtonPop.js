
import anime from 'animejs'
import { getMousePos } from "../HoverImg/HoverImg";
// import { debounce } from 'throttle-debounce'


class ButtonPop {
    constructor(el) {
        this.DOM = { el }

        this.DOM.reveal = document.createElement("div")
        this.DOM.reveal.className = "click-reveal"
        this.DOM.reveal.innerHTML = `<div class="click-reveal__inner">${this.DOM.el.dataset.info || "click to go see it"}</div>`
        this.DOM.el.appendChild(this.DOM.reveal)
        this.DOM.revealInner = this.DOM.reveal.querySelector('.click-reveal__inner')
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
            this.DOM.reveal.style.top = `${mousePos.y - 50 - docScrolls.top}px`
            this.DOM.reveal.style.left = `${mousePos.x - 30 - docScrolls.left}px`;
        }
        this.mouseenterFn = (ev) => {
            this.positionElement(ev);
            this.showInformation();
        };
        // this.mousemoveFn = ev => requestAnimationFrame(() => {
        //     this.positionElement(ev);
        // });
        this.mouseleaveFn = () => {
            this.hideInformation();
        };
        this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
        // this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
        this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
    }


    showInformation() {
        anime.remove(this.DOM.revealInner)
        this.tl = anime.timeline({
            begin: () => {
                this.DOM.reveal.style.backgroundColor = this.DOM.el.dataset.color
                this.DOM.reveal.style.opacity = 1
                this.DOM.el.style.zIndex = 1000
            }
        }).add({
            targets: this.DOM.revealInner,
            duration: 200,
            easing: "easeOutSine",
            translateX: ["-100%", "0%"]
        }, 0)
    }

    hideInformation() {
        anime.remove(this.DOM.revealInner)

        this.tl = anime.timeline({
            begin: () => this.DOM.el.style.zIndex = 999,
        })
        this.tl.add({
            targets: this.DOM.revealInner,
            duration: 200,
            easing: "easeOutSine",
            translateX: "100%", complete: () => {
                this.DOM.el.style.zIndex = ''
                this.DOM.reveal.style.opacity = 0
            },
        }, 0)
    }
}

[...document.querySelectorAll(".animated-button")].forEach(link => new ButtonPop(link))