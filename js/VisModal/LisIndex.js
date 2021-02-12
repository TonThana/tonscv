import * as d3 from "d3"

export const lisMain = () => {
    const container = document.querySelector(".modal__container")
    while (container.firstChild) {
        container.removeChild(container.lastChild)
    }
    const lisCon = document.createElement("div")
    lisCon.setAttribute("id", "lissajous-main")
    const lisExplanation = document.createElement("div")
    lisExplanation.setAttribute("id", "lissajous-explanation")
    lisExplanation.innerText = "a d3.js implementation of the Lissajous table, purely inspired by its mathematical beauty"
    container.appendChild(lisCon)
    container.appendChild(lisExplanation)
    make()
}
let columns_angle_data = []
let rows_angle_data = []
let curves = []
let angle = 0;
let cols = 0;
let width = 120;
let intervalId = null;
let allXCoords = [];
let allYCoords = [];

export const lisClose = () => {
    columns_angle_data = []
    rows_angle_data = []
    curves = []
    allXCoords = [];
    allYCoords = [];
    clearInterval(intervalId)
}




const make = () => {
    const CONTAINER_WIDTH = window.innerWidth * 0.7;
    // const CONTAINER_HEIGHT = window.innerHeight * 0.7;
    const CONTAINER_HEIGHT = CONTAINER_WIDTH
    console.log("width x height: ", CONTAINER_WIDTH, " x ", CONTAINER_HEIGHT);
    const svg = d3.select("#lissajous-main").append("svg");
    svg.attr("width", CONTAINER_WIDTH)
        .attr("height", CONTAINER_HEIGHT)
        .attr("id", "lissajous-svg");

    const ellipse_col_group = svg.append("g").attr("id", "ellipses-col-group");
    const ellipse_row_group = svg.append("g").attr("id", "ellipses-row-group");

    cols = Math.floor(CONTAINER_WIDTH / width);

    const r = width / 2 - 10;

    // initialize components
    columns_angle_data = Array.from(
        { length: cols - 1 },
        () => angle - Math.PI / 2
    );

    rows_angle_data = Array.from(
        { length: cols - 1 },
        () => angle + Math.PI
    );

    curves = new Array(cols - 1);

    for (let i = 0; i < curves.length; i += 1) {
        curves[i] = new Array(cols - 1);
        for (let j = 0; j < curves[0].length; j += 1) {
            curves[i][j] = [];
        }
    }
    // console.log(curves);
    // static
    ellipse_col_group
        .selectAll("ellipse")
        .data(columns_angle_data)
        .enter()
        .append("ellipse")
        .attr("id", (_d, i) => `ellipse-col-${i}`)
        .attr("cx", (_d, i) => width + i * width + width / 2)
        .attr("cy", width / 2)
        .attr("rx", r)
        .attr("ry", r)
        .attr("fill", "none")
        .attr("stroke", `rgb(0, 0, 0)`);

    ellipse_row_group
        .selectAll("ellipse")
        .data(rows_angle_data)
        .enter()
        .append("ellipse")
        .attr("id", (_d, i) => `ellipse-col-${i}`)
        .attr("cy", (_d, i) => width + i * width + width / 2)
        .attr("cx", width / 2)
        .attr("rx", r)
        .attr("ry", r)
        .attr("fill", "none")
        .attr("stroke", `rgb(0, 0, 0)`);

    const line = d3.line();

    const column_moving_els = ellipse_col_group
        .selectAll("g")
        .data(columns_angle_data)
        .enter()
        .append("g");

    const col_circles = column_moving_els
        .append("circle")
        .attr("id", (_d, i) => `circle-col-${i}`)
        .attr("cx", (d, i) => width + i * width + width / 2 + r * Math.cos(d))
        .attr("cy", (d, _i) => width / 2 + r * Math.sin(d))
        .attr("r", 5)
        .attr("stroke", "rgb(0,0,0)")
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr("class", "circle-col");

    allXCoords = [];
    const col_line = column_moving_els
        .append("path")
        .attr("d", (d, i) => {
            const xCoord = width + i * width + width / 2 + r * Math.cos(d);
            allXCoords.push(xCoord);
            return line([
                [xCoord, 0],
                [xCoord, CONTAINER_HEIGHT],
            ]);
        })
        .attr("stroke", `lightgrey`)
        .attr("stroke-weight", 0.5);

    const row_moving_els = ellipse_row_group
        .selectAll("g")
        .data(rows_angle_data)
        .enter()
        .append("g");

    const row_circle = row_moving_els
        .append("circle")
        .attr("id", (_d, i) => `circle-row-${i}`)
        .attr("cy", (d, i) => width + i * width + width / 2 + r * Math.cos(d))
        .attr("cx", (d, _i) => width / 2 + r * Math.sin(d))
        .attr("r", 5)
        .attr("stroke", "rgb(0,0,0)")
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr("class", "circle-col");

    allYCoords = [];
    const row_lines = row_moving_els
        .append("path")
        .attr("d", (d, i) => {
            const yCoord = width + i * width + width / 2 + r * Math.cos(d);
            allYCoords.push(yCoord);
            return line([
                [0, yCoord],
                [CONTAINER_WIDTH, yCoord],
            ]);
        })
        .attr("stroke", `lightgrey`)
        .attr("stroke-weight", 0.5);

    // console.log(allXCoords);
    // console.log(allYCoords);
    for (let i = 0; i < allYCoords.length; i += 1) {
        const currentY = allYCoords[i];
        for (let j = 0; j < allXCoords.length; j += 1) {
            const currentX = allXCoords[j];
            const fullCoords = {
                x: currentX,
                y: currentY,
            };
            curves[i][j].push(fullCoords);
        }
    }

    // initialize curves
    // console.log(curves);
    const all_curves = svg.append("g").attr("id", "all-curves");
    const curve_rows = all_curves
        .selectAll("g")
        .data(curves)
        .enter()
        .append("g")
        .attr("class", (_d, i) => `curve-row-${i}`);

    const curveLinegenerator = d3
        .line()
        .curve(d3.curveBasis)
        .x(d => d.x)
        .y(d => d.y);

    const curve_paths = curve_rows
        .selectAll("g")
        .data(d => d)
        .enter()
        .append("g")
        .attr("class", (_d, i) => `curve-column-${i}`)
        .append("path")
        .attr("d", d => curveLinegenerator(d))
        .attr("stroke", `rgb(0,0,0)`)
        .attr("stroke-width", 1)
        .attr("fill", "none");
    let update = true;
    // let allXCoords = [];
    // let allYCoords = [];
    let finishCount = 0;
    let prevFinishCount = 0;
    intervalId = setInterval(() => {
        // console.log("interval")
        if (update) {
            allXCoords = [];
            allYCoords = [];
        }

        // responsible for updating line and circle
        // but not curve
        columns_angle_data = columns_angle_data.map((data, i) => {
            let dataPoint = data;
            if (data > 2 * Math.PI) {
                dataPoint = 0;
            }

            const newData = dataPoint + 0.01 * (i + 1);
            return newData;
        });

        rows_angle_data = rows_angle_data.map((data, i) => {
            let dataPoint = data;
            if (data > 2 * Math.PI) {
                dataPoint = 0;
            }

            const newData = dataPoint + 0.01 * (i + 1);
            return newData;
        });

        col_circles
            .data(columns_angle_data)
            .enter()
            .merge(col_circles)
            .attr(
                "cx",
                (d, i) => width + i * width + width / 2 + r * Math.cos(d)
            )
            .attr("cy", (d, _i) => width / 2 + r * Math.sin(d));

        col_line
            .data(columns_angle_data)
            .enter()
            .merge(col_line)
            .attr("d", (d, i) => {
                const xCoord = width + i * width + width / 2 + r * Math.cos(d);
                if (update) {
                    allXCoords.push(xCoord);
                }

                return line([
                    [xCoord, 0],
                    [xCoord, CONTAINER_HEIGHT],
                ]);
            });

        row_circle
            .data(rows_angle_data)
            .enter()
            .merge(row_circle)
            .attr(
                "cy",
                (d, i) => width + i * width + width / 2 + r * Math.cos(d)
            )
            .attr("cx", (d, _i) => width / 2 + r * Math.sin(d));

        row_lines
            .data(rows_angle_data)
            .enter()
            .merge(row_lines)
            .attr("d", (d, i) => {
                const yCoord = width + i * width + width / 2 + r * Math.cos(d);
                if (update) {
                    allYCoords.push(yCoord);
                }

                return line([
                    [0, yCoord],
                    [CONTAINER_WIDTH, yCoord],
                ]);
            });

        if (update) {
            for (let i = 0; i < allYCoords.length; i += 1) {
                const currentY = allYCoords[i];
                for (let j = 0; j < allXCoords.length; j += 1) {
                    const currentX = allXCoords[j];
                    const fullCoords = {
                        x: currentX,
                        y: currentY,
                    };
                    curves[i][j].push(fullCoords);

                    const specific_row = svg.select(`.curve-row-${i}`);
                    const specific_col = specific_row.select(
                        `.curve-column-${j}`
                    );
                    specific_col
                        .selectAll("path")
                        .attr("d", d => curveLinegenerator(d));
                }
            }
        }

        if (curves[0][0].length > 70) {
            if (
                Math.floor(
                    curves[0][0][0].y + curves[0][0][curves[0][0].length - 1].y
                ) ===
                curves[0][0][0].y * 2
            ) {
                finishCount += 1;
            }
            if (finishCount === prevFinishCount && finishCount !== 0) {
                update = false;
                console.log("STOP")

            }
        }
        prevFinishCount = finishCount;
        // console.log(finishCount, prevFinishCount);
    }, 20);
};