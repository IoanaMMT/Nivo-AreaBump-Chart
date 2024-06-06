import React, { useState, useEffect } from "react";
import { ResponsiveAreaBump } from "@nivo/bump";
import axios from "axios";

const transformData = (apiData) => {
  const transformedData = apiData.reduce((acc, accident) => {
    const year = new Date(accident.date).getFullYear();
    const existingArea = acc.find(
      (area) => area.id === `Area ${accident.severity}`
    );

    if (existingArea) {
      const existingYearData = existingArea.data.find(
        (data) => data.x === year
      );
      if (existingYearData) {
        existingYearData.y += 1; // Increment count for the existing year
      } else {
        existingArea.data.push({ x: year, y: 1 });
      }
    } else {
      acc.push({
        id: `Area ${accident.severity}`,
        data: [{ x: year, y: 1 }],
      });
    }

    return acc;
  }, []);

  // Sort the data by year
  transformedData.forEach((area) => {
    area.data.sort((a, b) => a.x - b.x);
  });

  return transformedData;
};

const MyResponsiveAreaBump = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const years = [2013, 2014, 2015, 2016, 2017, 2018, 2019];
        const promises = years.map((year) =>
          axios.get(`https://api.tfl.gov.uk/AccidentStats/${year}`)
        );
        const responses = await Promise.all(promises);
        const allData = responses.flatMap((response) => response.data);
        const transformedData = transformData(allData);
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <ResponsiveAreaBump
      data={data}
      margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
      spacing={8}
      colors={{ scheme: "nivo" }}
      blendMode="multiply"
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "Area Fatal",
          },
          id: "dots",
        },
        {
          match: {
            id: "Area Serious",
          },
          id: "lines",
        },
      ]}
      startLabel="id"
      endLabel="id"
      axisTop={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendPosition: "middle",
        legendOffset: -36,
        truncateTickAt: 0,
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendPosition: "middle",
        legendOffset: 32,
        truncateTickAt: 0,
      }}
    />
  );
};

export default MyResponsiveAreaBump;
