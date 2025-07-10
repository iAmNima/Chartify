import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TimelineChart = ({ data, width = 700, height = 300 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 20, bottom: 50, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const parseDate = d3.utcParse('%Y-%m-%d');
    const parsedData = data.map((d) => ({
      ...d,
      date: parseDate(d.date),
    }));

    const x = d3
      .scaleTime()
      .domain(d3.extent(parsedData, (d) => d.date))
      .range([0, innerWidth]);

    const y = d3
      .scaleBand()
      .domain(parsedData.map((d) => d.label))
      .range([0, innerHeight])
      .padding(0.2);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5));

    g.append('g').call(d3.axisLeft(y));

    g.selectAll('rect')
      .data(parsedData)
      .join('rect')
      .attr('x', (d) => x(d.date) - 5)
      .attr('y', (d) => y(d.label))
      .attr('width', 10)
      .attr('height', y.bandwidth())
      .attr('fill', '#4299e1');

    g.selectAll('text.label')
      .data(parsedData)
      .join('text')
      .attr('x', (d) => x(d.date) + 10)
      .attr('y', (d) => y(d.label) + y.bandwidth() / 2 + 4)
      .text((d) => d.event)
      .attr('font-size', '12px')
      .attr('fill', '#2d3748');
  }, [data]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default TimelineChart;
