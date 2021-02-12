import * as d3 from 'd3'
import { visual } from "./visual";
const csvFile = require("./repeated_visits_hn_no_nan.xlsx - Sheet 1.csv")


export const visMain = () => {
    const container = document.querySelector(".modal__container")
    while (container.firstChild) {
        container.removeChild(container.lastChild)
    }
    const head = document.createElement('div')
    head.setAttribute("id", "head")
    const vis = document.createElement('div')
    vis.setAttribute("id", "vis")
    container.appendChild(head)
    container.appendChild(vis)
    const visExplan = document.createElement('div')
    visExplan.setAttribute("id", "vis-explanation")
    visExplan.innerText = "a d3.js visualisation of the discrepancies between pairs of radiologists in rating degrees of brain atrophy in a project on Alzheimer's Disease [a preliminary investigation, 2019]."
    container.appendChild(visExplan)
    loadCsv(csvFile, formatData);
}


const loadCsv = (csvFile, callback) => {
    d3.csv(csvFile).then(callback);
};

const colorSchemes = [
    "#2965CC",
    "#29A634",
    "#D99E0B",
    "#D13913",
    "#8F398F",
    "#00B3A4",
    "#DB2C6F",
    "#9BBF30",
    "#96622D",
    "#7157D9"
];

const formatData = data => {
    const new_key = "originalIndex";
    const old_key = "";
    const readers = {};
    data.forEach(o => {
        if (old_key !== new_key) {
            Object.defineProperty(
                o,
                new_key,
                Object.getOwnPropertyDescriptor(o, old_key)
            );
            delete o[old_key];
        }
        readers[o["ผู้ลงข้อมูล"]] = "";

        Object.defineProperty(o, "identifier", {
            value: `${o.hn}_${o.visit}`,
            writable: false
        });
    });

    const regroupData = data.reduce((r, a) => {
        r[a.identifier] = r[a.identifier] || [];
        r[a.identifier].push(a);
        return r;
    }, Object.create(null));
    // console.log(regroupData);
    const regroupDataArray = [];
    const diffsMap = {};
    Object.keys(regroupData).forEach(key => {
        let data = regroupData[key];
        const ref = data[0];
        const diffs = [];
        Object.keys(ref).forEach(refKey => {
            if (ref[refKey] !== data[1][refKey]) {
                diffs.push(refKey);
            }
        });
        const diffFiltered = diffs.filter(
            diff =>
                diff !== "ผู้ลงข้อมูล" &&
                diff !== "Reader" &&
                diff !== "originalIndex"
        );

        regroupDataArray.push(regroupData[key]);
        diffsMap[
            `${regroupData[key][0].hn}_${regroupData[key][0].visit
                .split(/\s+|\(|\)/)
                .join("")}`
        ] = diffFiltered;
    });

    // console.log(regroupDataArray, diffsMap);

    Object.keys(readers).forEach((reader, i) => {
        readers[reader] = colorSchemes[i];
    });

    visual(regroupDataArray, readers, diffsMap);
    return;
};


