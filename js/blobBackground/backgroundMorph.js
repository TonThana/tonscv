import scrollMonitor from 'scrollmonitor'
import anime from 'animejs'
import { pathActInit } from "../PathActivations/PathActivations";


const DOM = {}
DOM.svg = document.querySelector(".morph")
DOM.shapeEl = DOM.svg.querySelector("path")
DOM.contentElems = Array.from(document.querySelectorAll(".item"))
DOM.shapeLoopAnimId = null
const contentElemsTotal = DOM.contentElems.length



const shapes = [
    // 0
    {
        name: "first",
        path: 'M 262.9,252.2 C 210.1,338.2 212.6,487.6 288.8,553.9 372.2,626.5 511.2,517.8 620.3,536.3 750.6,558.4 860.3,723 987.3,686.5 1089,657.3 1168,534.7 1173,429.2 1178,313.7 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
        pathAlt: 'M 262.9,252.2 C 210.1,338.2 273.3,400.5 298.5,520 323.7,639.6 511.2,537.2 620.3,555.7 750.6,577.8 872.2,707.4 987.3,686.5 1102,665.6 1218,547.8 1173,429.2 1128,310.6 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
        scaleX: 2,
        scaleY: 1,
        rotate: 0,
        tx: 0,
        ty: -50,
        // fill: {
        //     color: '#0ACBCD',
        //     duration: 500,
        //     easing: 'linear'
        // },
        animation: {
            path: {
                duration: 3000,
                easing: 'easeOutElastic',
                elasticity: 600
            },
            svg: {
                duration: 2000,
                easing: 'easeOutElastic'
            }
        }
    },
    // 1
    {
        name: "second",
        path: 'M 415.6,206.3 C 407.4,286.6 438.1,373.6 496.2,454.8 554.3,536.1 497,597.2 579.7,685.7 662.4,774.1 834.3,731.7 898.5,653.4 962.3,575 967.1,486 937.7,370 909.3,253.9 937.7,201.5 833.4,105.4 729.3,9.338 602.2,13.73 530.6,41.91 459,70.08 423.9,126.1 415.6,206.3 Z',
        pathAlt: 'M 415.6,206.3 C 407.4,286.6 415.5,381.7 473.6,462.9 531.7,544.2 482.5,637.6 579.7,685.7 676.9,733.8 826.2,710.7 890.4,632.4 954.2,554 926.8,487.6 937.7,370 948.6,252.4 937.7,201.5 833.4,105.4 729.3,9.338 602.2,13.73 530.6,41.91 459,70.08 423.9,126.1 415.6,206.3 Z',
        scaleX: 1,
        scaleY: 1.5,
        rotate: 0,
        tx: 50,
        ty: 0,
        // fill: {
        //     color: '#81C36D',
        //     duration: 500,
        //     easing: 'linear'
        // },
        animation: {
            path: {
                duration: 3000,
                easing: 'easeOutElastic',
                elasticity: 600
            },
            svg: {
                duration: 3000,
                easing: 'easeOutElastic'
            }
        }
    },
    // 2
    {
        "name": "third",
        path: 'M 247.6,239.6 C 174.3,404.5 245.5,601.9 358.5,624.3 471.5,646.6 569.1,611.6 659.7,655.7 750.4,699.7 1068,687.6 1153,534.4 1237,381.1 1114,328.4 1127,227.4 1140,126.3 1016,51.08 924.6,116.8 833.8,182.5 928.4,393.8 706.8,283.5 485.2,173.1 320.8,74.68 247.6,239.6 Z',
        pathAlt: 'M 247.6,239.6 C 174.3,404.5 271.3,550.3 358.5,624.3 445.7,698.3 569.1,611.6 659.7,655.7 750.4,699.7 1145,699 1153,534.4 1161,369.8 1114,328.4 1127,227.4 1140,126.3 1016,51.08 924.6,116.8 833.8,182.5 894.5,431 706.8,283.5 519.1,136 320.8,74.68 247.6,239.6 Z',
        scaleX: 1,
        scaleY: 1.5,
        rotate: 0,
        tx: -65,
        ty: 0,
        // fill: {
        //     color: '#F5A547',
        //     duration: 500,
        //     easing: 'linear'
        // },
        animation: {
            path: {
                duration: 3000,
                easing: 'easeOutElastic',
                elasticity: 200
            },
            svg: {
                duration: 3000,
                easing: 'easeOutElastic'
            }
        }
    },
    // 3
    {
        name: "fourth",
        path: 'M 262.9,252.2 C 210.1,338.2 212.6,487.6 288.8,553.9 372.2,626.5 511.2,517.8 620.3,536.3 750.6,558.4 860.3,723 987.3,686.5 1089,657.3 1168,534.7 1173,429.2 1178,313.7 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
        pathAlt: 'M 262.9,252.2 C 210.1,338.2 273.3,400.5 298.5,520 323.7,639.6 511.2,537.2 620.3,555.7 750.6,577.8 872.2,707.4 987.3,686.5 1102,665.6 1218,547.8 1173,429.2 1128,310.6 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
        scaleX: 2,
        scaleY: 1,
        rotate: -20,
        tx: 0,
        ty: 60,
        // fill: {
        //     color: '#C0563A',
        //     duration: 500,
        //     easing: 'linear'
        // },
        animation: {
            path: {
                duration: 3000,
                easing: 'easeOutQuad',
                elasticity: 600
            },
            svg: {
                duration: 3000,
                easing: 'easeOutElastic'
            }
        }
    },
    {
        name: "fifth",
        path: 'M 262.9,252.2 C 210.1,338.2 212.6,487.6 288.8,553.9 372.2,626.5 511.2,517.8 620.3,536.3 750.6,558.4 860.3,723 987.3,686.5 1089,657.3 1168,534.7 1173,429.2 1178,313.7 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
        pathAlt: 'M 262.9,252.2 C 210.1,338.2 273.3,400.5 298.5,520 323.7,639.6 511.2,537.2 620.3,555.7 750.6,577.8 872.2,707.4 987.3,686.5 1102,665.6 1218,547.8 1173,429.2 1128,310.6 1096,189.1 995.1,130.7 852.1,47.07 658.8,78.95 498.1,119.2 410.7,141.1 322.6,154.8 262.9,252.2 Z',
        scaleX: 2.5,
        scaleY: 2,
        rotate: 0,
        tx: 0,
        ty: 0,
        // fill: {
        //     color: '#282faf',
        //     duration: 500,
        //     easing: 'linear'
        // },
        animation: {
            path: {
                duration: 3000,
                easing: 'easeOutQuad',
                elasticity: 600
            },
            svg: {
                duration: 3000,
                easing: 'easeOutElastic'
            }
        }
    },
    {
        name: "sixth",
        path: 'M 247.6,239.6 C 174.3,404.5 245.5,601.9 358.5,624.3 471.5,646.6 569.1,611.6 659.7,655.7 750.4,699.7 1068,687.6 1153,534.4 1237,381.1 1114,328.4 1127,227.4 1140,126.3 1016,51.08 924.6,116.8 833.8,182.5 928.4,393.8 706.8,283.5 485.2,173.1 320.8,74.68 247.6,239.6 Z',
        pathAlt: 'M 247.6,239.6 C 174.3,404.5 271.3,550.3 358.5,624.3 445.7,698.3 569.1,611.6 659.7,655.7 750.4,699.7 1145,699 1153,534.4 1161,369.8 1114,328.4 1127,227.4 1140,126.3 1016,51.08 924.6,116.8 833.8,182.5 894.5,431 706.8,283.5 519.1,136 320.8,74.68 247.6,239.6 Z',
        scaleX: 1.8,
        scaleY: 1.5,
        rotate: 0,
        tx: 250,
        ty: 50,
        // fill: {
        //     color: '#282faf',
        //     duration: 500,
        //     easing: 'linear'
        // },
        animation: {
            path: {
                duration: 3000,
                easing: 'easeOutElastic',
                elasticity: 600
            },
            svg: {
                duration: 2000,
                easing: 'easeOutExpo'
            }
        }
    },

];


let step;

const initShapeLoop = (pos) => {

    pos = pos || 0

    anime.remove(DOM.shapeEl)
    DOM.shapeLoopAnimId = anime({
        targets: DOM.shapeEl,
        easing: "linear",
        d: [{
            value: shapes[pos].pathAlt, duration: 3500
        }, {
            value: shapes[pos].path, duration: 3500
        }],
        loop: true,
        // fill: {
        //     value: shapes[pos].fill.color,
        //     duration: shapes[pos].fill.duration,
        //     easing: shapes[pos].fill.easing
        // },
        direction: 'alternate',
        autoplay: false
    })
}

const initShapeEl = () => {
    // console.log(shapes[0].name)
    anime.remove(DOM.svg);
    anime({
        targets: DOM.svg,
        duration: 1,
        easing: 'linear',
        scaleX: shapes[0].scaleX,
        scaleY: shapes[0].scaleY,
        translateX: shapes[0].tx + '%',
        translateY: shapes[0].ty + '%',
        rotate: shapes[0].rotate + 'deg',

    });
    initShapeLoop()
}



const createScrollWatchers = function () {
    // console.log(DOM.contentElems)
    DOM.contentElems.forEach((el, pos) => {
        // console.log(pos)
        const scrollElemToWatch = el

        // This will trigger when the element is 300 inside the viewport:
        const watcher = scrollMonitor.create(scrollElemToWatch, -200)
        watcher.enterViewport(function () {
            step = pos
            // console.log("HI", pos)
            anime.remove(DOM.shapeEl)

            anime({
                targets: DOM.shapeEl,
                duration: shapes[pos].animation.path.duration,
                easing: shapes[pos].animation.path.easing,
                elasticity: shapes[pos].animation.path.elasticity || 0,
                d: shapes[pos].path,
                // fill: {
                //     value: shapes[pos].fill.color,
                //     duration: shapes[pos].fill.duration,
                //     easing: shapes[pos].fill.easing
                // },

                complete: function () {
                    initShapeLoop(pos);
                }
            })
            anime.remove(DOM.svg)
            anime({
                targets: DOM.svg,
                duration: shapes[pos].animation.svg.duration,
                easing: shapes[pos].animation.svg.easing,
                elasticity: shapes[pos].animation.svg.elasticity || 0,
                scaleX: shapes[pos].scaleX,
                scaleY: shapes[pos].scaleY,
                translateX: shapes[pos].tx + '%',
                translateY: shapes[pos].ty + '%',
                rotate: shapes[pos].rotate + 'deg',
                complete: () => pathActInit()
            })

        })

        watcher.exitViewport(function () {
            // console.log("watcher.exitViewport")
            const idx = !watcher.isAboveViewport ? 0 : pos + 1
            // console.log(pos, idx, step, contentElemsTotal)
            if (idx <= contentElemsTotal && step !== idx) {
                step = idx
                anime.remove(DOM.shapeEl);
                anime({
                    targets: DOM.shapeEl,
                    duration: shapes[idx].animation.path.duration,
                    easing: shapes[idx].animation.path.easing,
                    elasticity: shapes[idx].animation.path.elasticity || 0,
                    d: shapes[idx].path,
                    // fill: {
                    //     value: shapes[idx].fill.color,
                    //     duration: shapes[idx].fill.duration,
                    //     easing: shapes[idx].fill.easing
                    // },

                    complete: function () {
                        // pathActInit()
                        initShapeLoop(idx);
                    }
                });
            }
            anime.remove(DOM.svg);
            anime({
                targets: DOM.svg,
                duration: shapes[idx].animation.svg.duration,
                easing: shapes[idx].animation.svg.easing,
                elasticity: shapes[idx].animation.svg.elasticity || 0,
                scaleX: shapes[idx].scaleX,
                scaleY: shapes[idx].scaleY,
                translateX: shapes[idx].tx + '%',
                translateY: shapes[idx].ty + '%',
                rotate: shapes[idx].rotate + 'deg',
                complete: () => pathActInit()
            });

        })
    })
}

export const backgroundMorphInit = function () {
    initShapeEl()
    createScrollWatchers()
}

export const backgroundMorphPause = function () {
    // console.log("PAUSE", DOM.shapeLoopAnimId)
    DOM.shapeLoopAnimId.pause()

}

export const backgroundMorphPlay = function () {
    // console.log("PLAY")
    DOM.shapeLoopAnimId.play()
}
