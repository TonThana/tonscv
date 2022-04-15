import imagesLoaded from 'imagesloaded'

import { backgroundMorphInit, backgroundMorphPause, backgroundMorphPlay } from './blobBackground/backgroundMorph'
import { staticBlobInit } from './shapeMorph'
import { webglStart, webglStop } from "./cosmicBackground/main";
// import { pathActInit } from "./PathActivations/PathActivations";
import getRandomInt from "./cosmicBackground/utils/getRandomInt";
import { start } from './harit2022/generativeAsciiArt'

const blobInit = () => {

    staticBlobInit()
    backgroundMorphInit()

    let morph_wrap = document.querySelector(".morph-wrap")

    let manic = document.querySelector('.manic')
    let peace = document.querySelector('.peace')

    let canvas;
    let state = "blob"

    // // test
    // const button = document.getElementById("testAnimControl-button")
    // button.style.position = "fixed"
    // button.style.top = "0"
    // button.addEventListener("click", () => {
    //     animate()
    // })

    // real
    let time = 5000
    function alternatingAnimation() {
        animate()
        time = getRandomInt(20000, 30000)
        window.setTimeout(alternatingAnimation, time)
    }

    window.setTimeout(alternatingAnimation, time)

    // things that need to change color when bg change


    let textsChange = document.querySelectorAll(".isText")
    let svgFillStrokeChange = document.querySelectorAll(".blackOnWhite_FillStroke")
    let decoBlobs = document.querySelectorAll(".decoblob")

    const animate = () => {
        console.log(state)
        if (state === "blob") {
            // display and hide glitching
            manic.style.visibility = "visible"
            setTimeout(() => {
                manic.style.visibility = "hidden"
            }, 1000)
            backgroundMorphPause()
            morph_wrap.style.visibility = "hidden"
            webglStart()
            canvas = document.querySelector("canvas")
            canvas.style.visibility = "visible"

            // change classes
            textsChange.forEach(el => {
                el.classList.remove("blackOnWhite_Text")
                el.classList.add("whiteOnBlack_Text")
            })
            svgFillStrokeChange.forEach(el => {
                el.classList.remove("blackOnWhite_FillStroke")
                el.classList.add("whiteOnBlack_FillStroke")
            })
            decoBlobs.forEach(el => el.style.fill = "#152238")
            state = "stars"
        } else if (state === "stars") {
            peace.style.visibility = "visible"
            setTimeout(() => {
                peace.style.visibility = "hidden"
            }, 1000)
            canvas.style.visibility = "hidden"

            webglStop()
            morph_wrap.style.visibility = "visible"
            state = "blob"

            // change classes
            textsChange.forEach(el => {
                el.classList.remove("whiteOnBlack_Text")
                el.classList.add("blackOnWhite_Text")
            })

            svgFillStrokeChange.forEach(el => {
                el.classList.remove("whiteOnBlack_FillStroke")
                el.classList.add("blackOnWhite_FillStroke")
            })
            decoBlobs.forEach(el => el.style.fill = "#fefefa")

            backgroundMorphPlay()

        }
    }



    imagesLoaded(document.body, () => {

        document.body.classList.remove('loading')
        document.body.classList.add('imgloaded');
        document.body.querySelectorAll('.notcv').forEach(cont => {
            cont.style.display = 'none'
        })
    })

    // imagesLoaded(document.querySelectorAll('.item__img'), () => {
    //     console.log("Ok")
    // })
}



// on page start, on page change
window.addEventListener('load', () => {
    const pathName = window.location.pathname
    console.log(pathName)
    if (pathName == "/") {
        blobInit()
    } else if (pathName == '/hbdhr22') {
        document.body.classList.remove('loading')
        const CVs = document.querySelectorAll(".cv")
        CVs.forEach(cont => {
            cont.style.display = "none"
        })
        start()
    }
})
