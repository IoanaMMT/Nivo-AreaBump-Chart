import React, { useEffect, useState } from "react";
import MyResponsiveAreaBump from "./MyResponsiveAreaBump";

const AreaBumpContainer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (year) => {
      try {
        const response = await fetch(
          `https://api.tfl.gov.uk/AccidentStats/${year}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return result;
      } catch (error) {
        return null;
      }
    };

    const loadValidData = async () => {
      const currentYear = new Date().getFullYear();
      let data = null;
      for (let year = currentYear; year >= currentYear - 5; year--) {
        data = await fetchData(year);
        if (data) {
          const processedData = processApiData(data);
          setData(processedData);
          break;
        }
      }
      if (!data) {
        setError("No valid data found for the past 5 years.");
      }
      setLoading(false);
    };

    loadValidData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <MyResponsiveAreaBump data={data} />;
};

const processApiData = (apiData) => {
  return [
    {
      id: "Accident Data",
      data: apiData.map((item) => ({
        x: new Date(item.date).getFullYear(),
        y: item.casualties.length,
      })),
    },
  ];
};

export default AreaBumpContainer;
