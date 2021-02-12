// random dynamically-generated bezier between blob1 and 2
// TODO: only in 'plain' mode
import anime from 'animejs'
import getRandomFloat from "../cosmicBackground/utils/getRandomFloat";
import getRandomInt from "../cosmicBackground/utils/getRandomInt";
import getRandomItem from "../cosmicBackground/utils/getRandomItem";

// //////////////////////////////////////////////////////
const strokeCOLORS = ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2f0CB", "#B5EAD7", "#C7CEEA"]

const getCoords = (el) => {
    const centerX = el.offsetLeft + el.offsetWidth / 2;
    const centerY = el.offsetTop + el.offsetHeight / 2
    return { centerX, centerY }
}

const constraint = .1
const generateDynamicBeziersPath = (startX, startY, minX, minY, maxX, maxY, endX, endY) => {

    const cubicBezier = `M${startX},${startY} C ${getRandomInt(minX, maxX)},${getRandomInt(minY, maxY)} ${getRandomInt(minX, maxX)},${getRandomInt(minY, maxY)} ${endX},${endY}`
    return cubicBezier
}
// ////////////////////////////////////////////////////////



export function dynamicBezierAnimation(startEl, endEl) {
    // console.log(startEl)
    const start = getCoords(startEl)
    const end = getCoords(endEl)
    const targetWrapper = document.querySelector(".overlay__wrapper")
    targetWrapper.innerHTML = ''

    const beziersFragment = document.createDocumentFragment();
    const bezierEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    bezierEl.setAttribute("width", "100%")
    bezierEl.setAttribute("height", "100%")

    const { centerX: startX, centerY: startY } = start;
    const { centerX: endX, centerY: endY } = end;
    // console.log(startX, startY, endX, endY)
    const minX = startX < endX ? (startX + constraint * startX) : (endX + constraint * endX)
    const maxX = startX > endX ? (startX - constraint * startX) : (endX - constraint * endX)
    const minY = startY < endY ? (startY + constraint * startY) : (endY + constraint * endY)
    const maxY = startY > endY ? (startY - constraint * startY) : (endY - constraint * endY)


    const nbrOfLines = 20;
    for (let index = 0; index < nbrOfLines; index += 1) {

        const cubicBezier = generateDynamicBeziersPath(startX, startY, minX, minY, maxX, maxY, endX, endY)
        const bezierPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        bezierPath.setAttribute("d", cubicBezier)
        bezierPath.classList.add("bezier_paths")
        bezierPath.setAttribute("stroke", getRandomItem(strokeCOLORS))
        bezierPath.setAttribute("stroke-width", `${getRandomFloat(0.1, 0.5)}em`)
        bezierPath.style.strokeDasharray = `${getRandomInt(10, 100)}`
        bezierPath.style.opacity = 0
        bezierEl.appendChild(bezierPath)
    }

    beziersFragment.appendChild(bezierEl)
    targetWrapper.appendChild(beziersFragment)

    const bezierPaths = document.querySelectorAll(".bezier_paths")
    anime.remove(bezierPaths)

    anime({
        targets: bezierPaths,
        strokeDashoffset: [anime.setDashoffset, 0],
        opacity: [0, 0.5, 0],
        easing: 'easeOutExpo',
        duration: 1500,
        delay: function (el, i) { return (i + 1) * 100 },
        // loop: true
    })
}