import * as d3 from 'd3'

const wrapLabel = (text, width) => {
    text.each(function () {
        const text = d3.select(this);
        let word;
        const words = text
            .text()
            .split(/\s+/)
            .reverse();
        // console.log(text.text());
        let line = [];
        let lineNumber = 0;
        const lineHeight = 0.4; // ems
        let y = text.attr("y");
        let dy = parseFloat(text.attr("dy"));
        let tspan = text
            .text(null)
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", dy + "em");
        while ((word = words.pop())) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text
                    .append("tspan")
                    .attr("x", 0)
                    .attr("y", y)
                    .attr("dy", `${++lineNumber * lineHeight + dy}em`)
                    .text(word);
            }
        }
        text.attr(
            "transform",
            `translate(0, -${text.node().getBoundingClientRect().height})`
        );
    });
};
export { wrapLabel };
