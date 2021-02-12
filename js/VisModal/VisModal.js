import { visMain } from "./VisIndex";
import { lisMain, lisClose } from "./LisIndex";
let lis = false
const openModal = () => {
    const modalTrigger = document.getElementsByClassName('jsModalTrigger')
    // set onClick event handler for all trigger element
    for (let i = 0; i < modalTrigger.length; i += 1) {
        modalTrigger[i].onclick = function () {
            const target = this.getAttribute('href').substr(1)
            const modalWindow = document.getElementById(target)
            modalWindow.classList ? modalWindow.classList.add('open') : modalWindow.className += ' ' + 'open'
            // 2 visualisations
            const classArr = Array.from(this.classList)
            if (classArr.includes("data-vis")) {
                visMain()
            } else if (classArr.includes("liss-vis")) {
                lisMain()
                lis = true

            }
        }
    }
}

const closeModal = () => {
    const closeButton = document.getElementsByClassName("jsModalClose")
    const closeOverlay = document.getElementsByClassName("jsOverlay")
    // set onlick event handler for close buttons
    for (let i = 0; i < closeButton.length; i += 1) {
        closeButton[i].onclick = function () {

            const modalWindow = this.parentNode;
            modalWindow.classList ? modalWindow.classList.remove('open') : modalWindow.className = modalWindow.className.replace(new RegExp('(^|\\b)' + 'open'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            if (lis) {
                lis = false
                lisClose()
            }
        }
    }

    /* Set onclick event handler for modal overlay */
    for (let i = 0; i < closeOverlay.length; i++) {
        closeOverlay[i].onclick = function () {
            const modalWindow = this.parentNode;

            modalWindow.classList ? modalWindow.classList.remove('open') : modalWindow.className = modalWindow.className.replace(new RegExp('(^|\\b)' + 'open'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            if (lis) {
                lis = false
                lisClose()
            }
        }
    }
}
/* Handling domready event IE9+ */
const ready = fn => {
    if (document.readyState != "loading") {
        fn()
    } else {
        document.addEventListener("DOMContentLoaded", fn)
    }
}


ready(openModal)
ready(closeModal)