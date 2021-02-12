import anime from 'animejs'
// import getRandomFloat from '../cosmicBackground/utils/getRandomFloat';
// import getRandomItem from '../cosmicBackground/utils/getRandomItem';

export const pathActInit = () => {
    // for background morph    
    const previousClone = document.querySelectorAll(".clone")
    if (previousClone) {
        previousClone.forEach(el => el.remove())
    }
    const DOM = {};
    DOM.svg = document.querySelector(".morph");
    DOM.shapeEl = DOM.svg.querySelector("path");
    const clone = DOM.shapeEl.cloneNode(false);
    DOM.svg.appendChild(clone)
    clone.style.fill = 'none'
    clone.classList.add("clone")
    pathActAnimate(clone)
}


const pathActAnimate = (el) => {
    el.setAttribute("stroke-dasharray", 100)
    el.setAttribute("stroke", "#F0BA26")
    el.setAttribute("opacity", "0.5")
    el.setAttribute("stroke-width", "2vw")

    anime({
        targets: el,
        duration: 10000,
        easing: "linear",
        strokeDashoffset: "100%",
        loop: true,
        scaleX: 1.2,
        scaleY: 1.2
    })
    anime({
        targets: el,
        opacity: [0, 1, 0],
        easing: "linear",
        loop: true,
        duration: 5000
    })
}   