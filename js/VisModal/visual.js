const d3 = require("d3");
const { debounce } = require("throttle-debounce");
const { wrapLabel } = require("./wrapLabel");

let readersCMAP;
let diffsMap;
const visual = (data, readers, diffs) => {
    readersCMAP = readers;
    diffsMap = diffs;
    const debounced_draw = debounce(500, draw);
    window.addEventListener("resize", function () {
        debounced_draw(data);
    });
    debounced_draw(data);
};

const draw = data => {
    const categories = [
        "Score on axial FLAIR images",
        "Atrophy Axial FLAIR",
        "MTA rating scale",
        "Score on Koedam",
        "Atrophy Koedam",
        "Midbrain Area",
        "Caudate nucleus",
        "Lentiform nucleus",
    ];

    // clean before draw / redraw
    d3.select("#vis")
        .selectAll("*")
        .remove();
    d3.select("#head")
        .selectAll("*")
        .remove();

    const dataLength = data.length;
    // console.log(data.length);
    // const padding = 0;
    const container_WIDTH = window.innerWidth * 0.7
    // const container_HEIGHT = window.innerHeight - padding;

    // console.log(
    //     "container width ",
    //     container_WIDTH,
    //     " container height ",
    //     container_HEIGHT
    // );

    const SVG_container = d3.select("#vis").append("svg");

    SVG_container.attr("width", container_WIDTH)
        .attr("height", dataLength * 100)
        .attr("id", "SVG_container");

    const SVG_head = d3.select("#head").append("svg");

    SVG_head.attr("width", container_WIDTH)
        .attr("height", 100)
        .attr("id", "SVG_head");

    // | ------ width x 100px | if overflow then new line

    // dealing with axis

    const { xTranslateTicks, translations_map, x, xAxis } = drawXAxis(
        container_WIDTH,
        SVG_head,
        categories
    );

    drawXGrid(SVG_container, xTranslateTicks, dataLength);
    drawContainerData(
        SVG_container,
        data,
        container_WIDTH,
        translations_map,
        categories
    );

    const enlargeCircle = function () {
        const thisCircle = d3.select(this);
        thisCircle
            .transition()
            .duration(750)
            .attr("r", 12);
    };
    const restoreCircleR = function () {
        const thisCircle = d3.select(this);
        thisCircle
            .transition()
            .duration(750)
            .attr("r", 8);
    };
    // sort - transition ?
    let sorttypeX = 0;
    SVG_head.append("circle")
        .attr("class", "sort-x-axis")
        .attr("r", 8)
        .attr("cx", "60")
        .attr("cy", "10")
        .attr("fill", "limegreen")
        .on("mouseover", enlargeCircle)
        .on("mouseout", restoreCircleR)
        .on("click", function () {
            const thisCircle = d3.select(this);
            console.log(sorttypeX);

            const sortedCategories = sortDiffX(diffsMap, sorttypeX);
            if (sorttypeX === 0) {
                sorttypeX = 1;
                thisCircle.attr("fill", "violet");
            } else if (sorttypeX === 1) {
                sorttypeX = 0;
                thisCircle.attr("fill", "limegreen");
            }
            const sortedCategoriesNameOnly = sortedCategories.map(
                item => item[0]
            );
            x.domain(sortedCategoriesNameOnly);
            const svgHeadTransition = SVG_head.transition().duration(750);
            // const delay = (d, i) => {
            //     return i * 50;
            // };
            svgHeadTransition.select(".x.axis").call(xAxis);
            // .delay(750);

            const translations_map = {};
            svgHeadTransition.on("end", function () {
                d3.select(this)
                    .selectAll(".tick")
                    .each(function (d) {
                        const T = d3.select(this).attr("transform");
                        translations_map[d] = T.split(
                            /^translate\(|\)$|,/
                        ).filter(d => d !== "");
                    });
                console.log("NEW TRANSLATION MAP: ", translations_map);
                // console.log("hello");

                SVG_container.selectAll(".datagroup").remove();
                // console.log(SVG_container.selectAll(".datagroup"));
                drawContainerData(
                    SVG_container,
                    data,
                    container_WIDTH,
                    translations_map,
                    sortedCategoriesNameOnly
                );
            });
        });
    let sorttypeY = 0;

    SVG_head.append("circle")
        .attr("class", "sort-y-axis")
        .attr("r", 8)
        .attr("cx", 10)
        .attr("cy", 60)
        .attr("fill", "rgb(219,196,42)")
        .on("mouseover", enlargeCircle)
        .on("mouseout", restoreCircleR)
        .on("click", function () {
            const thisCircle = d3.select(this);
            const sortedHN = sortDiffY(diffsMap, sorttypeY);
            if (sorttypeY === 0) {
                sorttypeY = 1;
                thisCircle.attr("fill", "tomato");
            } else if (sorttypeY === 1) {
                sorttypeY = 0;
                thisCircle.attr("fill", "rgb(219,196,42)");
            }
            const sortedHNNameOnly = sortedHN.map(item => item[0]);
            console.log(sortedHNNameOnly);
            let dataGroups = SVG_container.selectAll(".datagroup");

            dataGroups.sort(function (a, b) {
                const compare =
                    sortedHNNameOnly.indexOf(
                        `${a[0].hn}_${a[0].visit.split(/\s+|\(|\)/).join("")}`
                    ) -
                    sortedHNNameOnly.indexOf(
                        `${b[0].hn}_${b[0].visit.split(/\s+|\(|\)/).join("")}`
                    );
                return compare;
            });

            dataGroups = SVG_container.selectAll(".datagroup");
            dataGroups
                .transition()
                .duration(750)
                .delay((_, i) => i * 50)
                .attr("transform", (_d, i) => `translate(0,${100 * i + 0})`);
        });
};

function drawContainerData(
    SVG_container,
    data,
    container_WIDTH,
    translations_map,
    categories
) {
    const vis_group = SVG_container.selectAll(".datagroup")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "datagroup")
        .attr("transform", (_d, i) => `translate(0,${100 * i + 0})`)
        .attr("id", d => {
            // console.log(d); // [{...},{...}]
            return `${d[0].hn}_${d[0].visit.split(/\s+|\(|\)/).join("")}`;
        });
    vis_group
        .append("text")
        .text(d => {
            // console.log(d);
            return `${d[0].hn}
        `;
        })
        .attr("transform", `translate(0, 50)`);

    vis_group
        .append("text")
        .text(d => {
            // console.log(d);
            return `${d[0].visit}
        `;
        })
        .attr("transform", `translate(0, 10)`)
        .attr("font-size", "0.7em")
        .attr("dy", 0.7)
        .attr("fill", "lightgrey");

    vis_group
        .append("line")
        .attr("x1", 0)
        .attr("x2", container_WIDTH)
        .attr("y1", 100)
        .attr("y2", 100)
        .style("stroke", "lightgrey")
        .attr("opacity", 0.7);

    const eachReader = vis_group
        .selectAll("g")
        .data(d => d)
        .enter()
        .append("g")
        .attr("class", (_d, i) => i)
        .attr("id", d => d["ผู้ลงข้อมูล"])
        .attr("transform", `translate(0, 50)`);

    const lineData = {};
    eachReader
        .selectAll("g")
        // if sort x -> categories will change order
        .data(d => categories.map(cat => [cat, d[cat]]))
        .enter()
        .append("g")
        .append("circle")
        .each(drawCircle(translations_map, lineData));

    // eachReader.selectAll("text").call(wrapLabel, 10);

    const startingLine = categories.map(() => [0, 0]);
    // line for each Reader
    eachReader.each(function (_d) {
        // get text width
        const lineGroup = d3.select(this);
        const parent = d3.select(this.parentNode);
        const { width } = parent
            .select("text")
            .node()
            .getBoundingClientRect();
        const id = parent.attr("id");
        const readerName = lineGroup.attr("id");
        const specificLineData = [
            [width, 0],
            ...lineData[id][readerName],
            [container_WIDTH + width, 0],
        ];
        const line = d3.line().curve(d3.curveNatural);
        lineGroup
            .append("path")
            .attr(
                "d",
                line([
                    [width, 0],
                    ...startingLine,
                    [container_WIDTH + width, 0],
                ])
            )
            .attr("stroke", readersCMAP[readerName])
            .attr("fill", "none")
            .attr("class", "line")
            .transition()
            .duration(750)
            .attr("d", line(specificLineData));
    });
}

function drawCircle(translations_map, lineData) {
    return function (d) {
        const circle = d3.select(this);
        const parent = d3.select(this.parentNode.parentNode);
        const readerIndex = parent.attr("class");
        const readerName = parent.attr("id");
        const columnName = d[0];
        const gparentId = d3
            .select(this.parentNode.parentNode.parentNode)
            .attr("id");
        const multiplier = readerIndex === "0" ? 1 : -1;
        const isDiff = diffsMap[gparentId].indexOf(columnName) > -1;
        const separation = isDiff ? 25 : 1.5;
        const opacity = isDiff ? 1 : 0.5;
        const cx = translations_map[columnName][0];
        const cy =
            parseInt(translations_map[columnName][1]) + multiplier * separation;
        // can be used for line points at each circle
        lineData[gparentId] = lineData[gparentId] || {};
        lineData[gparentId][readerName] = lineData[gparentId][readerName] || [];
        lineData[gparentId][readerName].push([cx, cy]);
        circle
            .attr("cx", `${cx}`)
            .attr("cy", `${cy}`)
            .attr("r", 5)
            .attr("fill", readersCMAP[readerName])
            .attr("opacity", opacity);
        if (isDiff) {
            addText.call(this, cx, cy);
        } else {
            // console.log(parent.attr("class"));
            if (parent.attr("class") === "1") {
                circle
                    .on("mouseover", () => {
                        let modifiedCy = cy - 30;
                        addText.call(this, cx, modifiedCy);
                    })
                    .on("mouseout", () => {
                        removeText.call(this);
                    });
            }
        }
    };

    function removeText() {
        d3.select(this.parentNode)
            .selectAll("g.textgroup")
            .attr("opacity", 1)
            .transition()
            .duration(700)
            .attr("opacity", 0)
            .remove();
    }
    function addText(cx, cy) {
        d3.select(this.parentNode)
            .append("g")
            .attr("class", "textgroup")
            .attr("transform", `translate(${cx + 100}, ${cy + 25})`)
            .append("text")
            .attr("class", "circledifftext")
            .attr("opacity", 0)
            .attr("dy", 0)
            .text(d => d[1])
            .attr("font-size", "0.85em")
            .call(wrapLabel, 10)
            .attr("fill", "black")
            .transition()
            .duration(500)
            .attr("opacity", 1);
    }
}

function drawXGrid(SVG_container, xTranslateTicks, dataLength) {
    SVG_container.append("g")
        .selectAll("line")
        .data(xTranslateTicks)
        .enter()
        .append("line")
        // .attr("height", dataLength * 100)
        .attr("x1", d => d)
        .attr("x2", d => d)
        .attr("y1", 0)
        .attr("y2", dataLength * 100)
        .attr("stroke", "lightgrey")
        .attr("opacity", 0.5);
}

function drawXAxis(container_WIDTH, SVG_head, categories) {
    const x = d3
        .scalePoint()
        .domain(categories)
        .range([100, parseInt(container_WIDTH, 10) - 60]);
    const xAxis = d3.axisTop().scale(x);
    SVG_head.append("g")
        .attr("class", "x axis")
        .call(xAxis)
        .attr("transform", `translate(0, 70) `)
        .selectAll(".tick text")
        .attr("transform", "rotate(-20) translate(0, -30)");
    // .call(wrapLabel, x.bandwidth());
    const xTranslateTicks = [];
    SVG_head.selectAll("g .tick").each(function (data) {
        const tick = d3.select(this);
        const transform = tick.attr("transform");
        const xTranslate = transform.split(/^translate\(|\)$|,/)[1];
        xTranslateTicks.push(xTranslate);
    });
    // obtain translation for label
    const translations_map = {};
    SVG_head.selectAll(".tick").each(function (d) {
        translations_map[d] = d3
            .select(this)
            .attr("transform")
            .split(/^translate\(|\)$|,/)
            .filter(d => d !== "");
    });

    return { xTranslateTicks, translations_map, x, xAxis };
}

const sortDiffX = (diffsMap, sorttypeX) => {
    // sort which category MOST / LEAST -> LEAST / MOST discrepancies.
    // specified with sorttypeX 1 or 0
    const freq = {};
    Object.keys(diffsMap).forEach(key => {
        diffsMap[key].forEach(item => {
            if (!freq.hasOwnProperty(item)) {
                freq[item] = 0;
            }
            freq[item] += 1;
        });
    });

    const sortable = [];
    for (let category in freq) {
        sortable.push([category, freq[category]]);
    }

    if (sorttypeX === 1) {
        sortable.sort((a, b) => {
            return a[1] - b[1];
        });
    } else {
        sortable.sort((a, b) => {
            return b[1] - a[1];
        });
    }

    return sortable;
};

const sortDiffY = (diffsMap, sorttypeY) => {
    const howManyPerHN = {};

    Object.keys(diffsMap).forEach(key => {
        howManyPerHN[key] = diffsMap[key].length;
    });

    const sortable = [];
    for (let key in howManyPerHN) {
        sortable.push([key, howManyPerHN[key]]);
    }

    if (sorttypeY === 1) {
        sortable.sort((a, b) => {
            return a[1] - b[1];
        });
    } else {
        sortable.sort((a, b) => {
            return b[1] - a[1];
        });
    }

    console.log(sortable);
    return sortable;
};

export { visual };
