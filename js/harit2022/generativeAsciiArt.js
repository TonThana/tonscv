import anime from 'animejs'
import { ascii } from './asciiHtmlCodes'
import { palette } from './colorPalette'
import getRandomInt from '../cosmicBackground/utils/getRandomInt'
import { bigH, A, R, I, firstT, smallH, B, D, firstTwo, zero, secondT, secondTwo, thirdTwo, Heart, O, N } from './messages'

import 'regenerator-runtime/runtime'


const MIRRORS = ["MIRROR_QUARD", "MIRROR_HORIZONTAL", "MIRROR_VERTICAL"]
const PALETTE_LEN = palette.length - 1

export const start = () => {
    // const asciiLen = ascii.length - 1

    // generate grid div
    const container = document.getElementById("hbdhr22_asciiArt")
    let maxColumn = 20;
    let maxRow = 32;
    for (let row = 1; row <= maxRow; row += 1) {
        for (let col = 1; col <= maxColumn; col += 1) {
            let newDiv = document.createElement("span")
            newDiv.id = `grid-${col}-${row}`
            // default
            newDiv.innerHTML = "d"
            container.appendChild(newDiv)
        }
    }

    // start of randomising things


    const recursiveAnimationCall = async counter => {
        return new Promise((resolve) => {
            // if (counter == 5) {
            //     resolve('end')
            //     return
            // }
            if (counter % 4 == 0) {
                animateForever(true).then(() => resolve(recursiveAnimationCall(++counter)))
            }
            else {
                animateForever(false).then(() => resolve(recursiveAnimationCall(++counter)))
            }


        })
    }

    let counter = 1
    recursiveAnimationCall(counter).then((msg) => {
        console.log(msg)
    })
}


async function animateForever(isSpecial) {
    let pixelRectangles;
    if (isSpecial) {
        pixelRectangles = [bigH, A, R, I, firstT, smallH, B, D, firstTwo, zero, secondT, secondTwo, thirdTwo, Heart, O, N]
    } else {
        pixelRectangles = generatePixelLists(MIRRORS[0]);
    }

    const animationLists = [];
    let animation;
    pixelRectangles.forEach(rect => {
        // let randomAsciiIndex = Math.round(Math.random() * asciiLen)
        const colorComb = []
        for (let i = 0; i < getRandomInt(1, 10); i += 1) {
            let randomColorIndex = Math.round(Math.random() * PALETTE_LEN)
            let randomColorSubIndex = Math.round(Math.random() * 4)
            // let asciiCode = ascii[randomAsciiIndex]
            let asciiColor = palette[randomColorIndex][randomColorSubIndex]
            colorComb.push(asciiColor)
        }



        const animationTargets = [];

        // can be randomise to control animation direction?
        rect.forEach((coord, i) => {
            // console.log(coord)
            const el = document.getElementById(`grid-${coord[0]}-${coord[1]}`)
            animationTargets.push(el)
            // el.style.color = asciiColor[]
            el.innerHTML = isSpecial ? "&#9608;" : ""
            el.classList.add("assigned")

            // we can also use to unassigned ones as another group

        }
        )


        const testCode = isSpecial ? ["&#9608;", "&#9608;"] : generateRandomHTMLCodeStartEnd_Color()

        // let test = document.getElementById("grid-15-22")
        animation = anime({
            targets: animationTargets,
            innerHTML: testCode,
            opacity: [0, 1, 0, isSpecial ? 1 : 0],
            easing: 'steps(4)',
            color: colorComb,
            duration: 3000,
            round: 1,
            delay: anime.stagger(5),
            complete: () => animationTargets.forEach(el => el.className = ''),

        }).finished;
        animationLists.push(animation)
    }
    )
    // unassigned 
    const unassigned = document.querySelectorAll("span:not(.assigned)")

    animation = anime({
        begin: () => {
            unassigned.forEach(x => x.style.opacity = 1)
        },
        targets: unassigned,
        innerHTML: generateRandomHTMLCodeStartEnd_Color(),
        opacity: 1,
        duration: 3000,
        delay: 0
    }).finished
    animationLists.push(animation)
    // animationLists.forEach(x => x.play())
    await Promise.all([...animationLists])
}

const generateRandomHTMLCodeStartEnd_Color = () => {
    const maxNumberOfChars = 50
    const minNumberOfChars = 2
    const numberOfChars = getRandomInt(minNumberOfChars, maxNumberOfChars)
    // console.log(numberOfChars)
    const asciiLen = ascii.length - 1
    const HTMLCodeArray = []
    let randomAsciiIndex = Math.round(Math.random() * asciiLen)
    const initialNumber = ascii[randomAsciiIndex]
    HTMLCodeArray.push(initialNumber)

    let numberPart = initialNumber.replace("&#", "")
    numberPart = numberPart.replace(";", "")
    let endingNumber;
    if (Math.round(Math.random()) % 2 == 1) {
        //  add
        endingNumber = Number(numberPart) + numberOfChars;
        endingNumber > asciiLen ? endingNumber = Number(numberPart) - numberOfChars : endingNumber;
        HTMLCodeArray.push(`&#${endingNumber}`)
    } else {
        endingNumber = Number(numberPart) - numberOfChars
        endingNumber < 0 ? endingNumber = Number(numberPart) + numberOfChars : endingNumber
        HTMLCodeArray.push(`&#${endingNumber}`)
        // 

    }
    // console.log(HTMLCodeArray)
    return HTMLCodeArray
}


// Maze generation algorithm 
// Mondrian art


const generatePixelLists = (mirror = MIRRORS[0], numberUnique = 20) => {
    // big span
    const blockSpans = []
    const centerCoords = []


    // maxX 10 maxY 16 is quadrant 2*maxX+1-x and 2*maxY+1-y also + hori + verti
    // maxX 20 maxY 32 is no plane
    // maxX 10 maxY 32 is vertical plane (10-x)+11 = 2*maxX+1-x
    // maxX 20 maxY 16 is horizontal plane  (16-y)+17 = 2*maxY+1-y
    let maxX = 20, maxY = 32, minX = 1, minY = 1;
    // let smallestSpanX, largestSpanX,smallestSpanY, largestSpanY
    switch (mirror) {
        case MIRRORS[0]:
            maxX = 10, maxY = 16, minX = 1, minY = 1;
            numberUnique = 5
            // smallestSpanX = maxX/4
            // largestSpanY = maxY/2
            break;
        case MIRRORS[1]:
            maxX = 20, maxY = 16, minX = 1, minY = 1;
            numberUnique = 10
            break;
        case MIRRORS[2]:
            maxX = 10, maxY = 32, minX = 1, minY = 1;
            numberUnique = 10
            break;

        default:
            maxX = 10, maxY = 16, minX = 1, minY = 1;
            numberUnique = 5
            break;
    }

    for (let i = 0; i < numberUnique; i += 1) {
        blockSpans.push([getRandomInt(Math.round(maxX / 4), maxX), getRandomInt(Math.round(maxY / 4), maxY)])
        centerCoords.push([getRandomInt(minX, maxX), getRandomInt(minY, maxY)])
    }
    // randomise center coordinates


    // generate potential pixel list from span
    const bigSpanPotentialPixelList = [];
    blockSpans.forEach(([xSpan, ySpan], index) => {
        const startAtX = centerCoords[index][0] - Math.floor(xSpan / 2)
        const startAtY = centerCoords[index][1] - Math.floor(ySpan / 2)
        let xRange = range(xSpan, startAtX)
        let yRange = range(ySpan, startAtY)
        xRange = xRange.filter(x => x >= 1 && x <= maxX)
        yRange = yRange.filter(y => y >= 1 && y <= maxY)
        bigSpanPotentialPixelList.push(xRange.flatMap(x => yRange.map(y => [x, y])))
    })

    const ascending = bigSpanPotentialPixelList.sort((a, b) => a.length - b.length)

    // discard overlap - using smaller coords set to filter out larger ones on and on
    ascending.forEach((rect, index) => {
        if (index + 1 < ascending.length) {
            let filtered = []
            ascending[index + 1].forEach(newCoord => {
                let isGood = true;
                rect.forEach(coord => {
                    if (newCoord[0] == coord[0] && newCoord[1] == coord[1]) {
                        isGood = false
                    }
                })
                if (isGood) {
                    filtered.push(newCoord)

                }
            })
            ascending[index + 1] = filtered
        }
    })

    // if we have plane of symmetry - generate the mirror image
    // for example horizpntal plane
    // ordering of array element will equates to animation order. 

    // sort first before mirroring

    // let sortWhichDirection = 2;
    // switch (sortWhichDirection) {
    //     case 1:
    //         sortedRect = ascending.sort((a, b) => b[0] - a[0])
    //         break;
    //     case 2:
    //         sortedRect = ascending.sort((a, b) => a[0] - b[0])
    //         break;
    //     case 3:
    //         sortedRect = ascending.sort((a, b) => a[1] - b[1])
    //         break;
    //     case 4:
    //         sortedRect = ascending.sort((a, b) => b[1] - a[1])
    //     default:
    //         sortedRect = ascending.sort((a, b) => b[0] - a[0])
    //         break;
    // }

    // mirroring
    let mirroredSortedRect = [];
    ascending.forEach((rect, index) => {
        let newRect = []

        let sortWhichDirection = getRandomInt(1, 4);
        switch (sortWhichDirection) {
            case 1:
                rect = rect.sort((a, b) => b[0] - a[0])
                break;
            case 2:
                rect = rect.sort((a, b) => a[0] - b[0])
                break;
            case 3:
                rect = rect.sort((a, b) => a[1] - b[1])
                break;
            case 4:
                rect = rect.sort((a, b) => b[1] - a[1])
            default:
                rect = rect.sort((a, b) => b[0] - a[0])
                break;
        }



        rect.forEach(coord => {
            newRect.push(coord)
            if (mirror == MIRRORS[0]) {
                newRect.push([2 * maxX + 1 - coord[0], 2 * maxY + 1 - coord[1]])
                newRect.push([coord[0], 2 * maxY + 1 - coord[1]])
                newRect.push([2 * maxX + 1 - coord[0], coord[1]])
            } else if (mirror == MIRRORS[1]) {
                newRect.push([coord[0], 2 * maxY + 1 - coord[1]])
            } else if (mirror == MIRRORS[2]) {
                newRect.push([2 * maxX + 1 - coord[0], coord[1]])
            }

        })
        mirroredSortedRect.push(newRect)
    })

    return mirroredSortedRect

}

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}