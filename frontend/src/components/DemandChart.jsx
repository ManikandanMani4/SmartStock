function DemandChart() {
  const data = [
    45,
    60,
    52,
    72,
    65,
    80,
    75,
  ];

  return (
    <div className="chart-card">

      <div className="card-header">
        <div>
          <h3>Demand Forecast</h3>
          <p>Predicted demand for next 7 days</p>
        </div>

        <select>
          <option>Next 7 Days</option>
          <option>Next 30 Days</option>
        </select>
      </div>

      <div className="chart">

        {data.map((value, index) => (
          <div className="chart-column" key={index}>

            <div
              className="chart-bar"
              style={{
                height: `${value}%`,
              }}
            ></div>

            <span>
              Day {index + 1}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}

export default DemandChart;