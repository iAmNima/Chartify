import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BoxPlotChart = ({ data, width = 500, height = 300 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const labels = data.map((d) => d.label);
    const x = d3.scaleBand().domain(labels).range([0, innerWidth]).padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.max)])
      .nice()
      .range([innerHeight, 0]);

    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
    g.append('g').call(d3.axisLeft(y));

    // Boxes
    g.selectAll('boxes')
      .data(data)
      .join('rect')
      .attr('x', (d) => x(d.label))
      .attr('y', (d) => y(d.q3))
      .attr('height', (d) => y(d.q1) - y(d.q3))
      .attr('width', x.bandwidth())
      .attr('stroke', 'black')
      .style('fill', '#90cdf4');

    // Median line
    g.selectAll('medianLines')
      .data(data)
      .join('line')
      .attr('x1', (d) => x(d.label))
      .attr('x2', (d) => x(d.label) + x.bandwidth())
      .attr('y1', (d) => y(d.median))
      .attr('y2', (d) => y(d.median))
      .attr('stroke', 'black');

    // Whiskers
    g.selectAll('minLines')
      .data(data)
      .join('line')
      .attr('x1', (d) => x(d.label) + x.bandwidth() / 2)
      .attr('x2', (d) => x(d.label) + x.bandwidth() / 2)
      .attr('y1', (d) => y(d.min))
      .attr('y2', (d) => y(d.q3))
      .attr('stroke', 'black');

    g.selectAll('maxLines')
      .data(data)
      .join('line')
      .attr('x1', (d) => x(d.label) + x.bandwidth() / 2)
      .attr('x2', (d) => x(d.label) + x.bandwidth() / 2)
      .attr('y1', (d) => y(d.q1))
      .attr('y2', (d) => y(d.max))
      .attr('stroke', 'black');
  }, [data]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default BoxPlotChart;
