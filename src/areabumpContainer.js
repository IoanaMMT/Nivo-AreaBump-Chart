import React, { useEffect, useState } from "react";
import MyResponsiveAreaBump from "./areabump";

const AreaBumpContainer = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const year = new Date().getFullYear(); // Get the current year
        const response = await fetch(
          `https://api.tfl.gov.uk/AccidentStats/${year}`
        );
        const result = await response.json();
        const processedData = processApiData(result);
        setData(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return <MyResponsiveAreaBump data={data} />;
};

// Replace with actual logic to process API data
const processApiData = (apiData) => {
  // Example transformation, adjust based on the API response structure
  return [
    {
      id: "Accident Data",
      data: apiData.map((item, index) => ({
        x: new Date(item.date).getFullYear(), // Assuming date is in YYYY-MM-DD format
        y: item.casualties.length, // Use the number of casualties as the value
      })),
    },
  ];
};

export default AreaBumpContainer;
