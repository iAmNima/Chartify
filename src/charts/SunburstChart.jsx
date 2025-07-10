import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SunburstChart = ({ data, width = 500, height = 500 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const radius = Math.min(width, height) / 2;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Construct hierarchy
    const root = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

    const partition = d3.partition().size([2 * Math.PI, radius]);
    partition(root);

    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const g = svg
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .append('g');

    g.selectAll('path')
      .data(root.descendants().filter((d) => d.depth > 0))
      .join('path')
      .attr('d', arc)
      .attr('fill', (d) => color((d.children ? d : d.parent).data.name))
      .append('title')
      .text((d) => `${d.data.name}\n${d.value}`);
  }, [data]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default SunburstChart;
