function getRequest(chart_ids, latitude, longitude) {
  createMap(latitude, longitude);
  let request = new XMLHttpRequest();
  request.onreadystatechange = function(){
      if (this.readyState === 4 && this.status === 200){
        setupGraphs(this.response, chart_ids);
      }
  };
  if (latitude == "" || longitude == "") {
    getQueryStr = 'https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=49NfWx6Geet6fenXSI3Y1zy8GOiLixl06hFqU3cl&lon=-100'
  } else {
    getQueryStr = 'https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=49NfWx6Geet6fenXSI3Y1zy8GOiLixl06hFqU3cl&lat=' + String(latitude) + '&lon=-' + String(longitude)
  }
  request.open("GET", getQueryStr);
  request.send();
}

function setupGraphs(response, chart_ids) {
  setupLineGraph(response, chart_ids);
  setupPieGraph(response, "pie_graph", chart_ids);
  setupBarGraph(response, "bar_graph", chart_ids);
}

async function setupBarGraph(response, barGraph, chart_ids) {
  const ctx = document.getElementById(barGraph).getContext('2d');
  const parsedData = [await getDataPieBar(response, "avg_dni"), await getDataPieBar(response, "avg_ghi"), await getDataPieBar(response, "avg_lat_tilt")];
  console.log(parsedData)
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        'annual_dni',
        'annual_ghi',
        'annual_lat_tilt'
      ],
      datasets: [{
          label: barGraph.substring(0, barGraph.length - 6),
          data: parsedData,
          backgroundColor: [
            '#9e5eeb',
            '#4880f0',
            '#f55442'
          ],
        }
      ]
    },
    options: {}
  });
}


async function setupPieGraph(response, pieGraph, chart_ids) {
  const ctx = document.getElementById(pieGraph).getContext('2d');
  const parsedData = [await getDataPieBar(response, "avg_dni"), await getDataPieBar(response, "avg_ghi"), await getDataPieBar(response, "avg_lat_tilt")];
  if (typeof parsedData[0] == undefined) { parsedData = [1,0,0] }
  const myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [
        'annual_dni',
        'annual_ghi',
        'annual_lat_tilt'
      ],
      datasets: [{
          label: pieGraph.substring(0, pieGraph.length - 6),
          data: parsedData,
          backgroundColor: [
            '#9e5eeb',
            '#4880f0',
            '#f55442'
          ],
          borderColor: [
            '#9e5eeb',
            '#4880f0',
            '#f55442'
          ],
          borderWidth: 1
        }
      ]
    },
    options: {}
  });
}

async function setupLineGraph(response, chart_ids) {
  for (let i = 0; i < chart_ids.length; i++) {
    const ctx = document.getElementById(chart_ids[i]).getContext('2d');
    const parsedData = await getData(response, chart_ids[i]);
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: parsedData.month,
        datasets: [{
            label: chart_ids[i].substring(0, chart_ids[i].length - 6),
            data: parsedData.solar_data,
            fill: false,
            borderColor: '#4880f0',
            backgroundColor: '#4880f0',
            borderJoinStyle: "round",
            borderWidth: 2,
          }
        ]
      },
      options: {}
    });
  }
}

function getDataPieBar(response, chart_id) {
  let data = JSON.parse(response)
  if (chart_id == "avg_dni") {
    return data['outputs']['avg_dni']['annual'];
  }
  if (chart_id == "avg_ghi") {
    return data['outputs']['avg_ghi']['annual'];
  }
  if (chart_id == "avg_lat_tilt") {
    return data['outputs']['avg_lat_tilt']['annual'];
  }
}

function getData(response, chart_id) {
  let data = JSON.parse(response)
  if (data["outputs"][chart_id.substring(0, chart_id.length - 6)] == "no data") {
    document.getElementById("hidden").style.display = "inline";
    document.getElementById("annual_lat_tilt").textContent = "N/A";
    document.getElementById("annual_dni").textContent = "N/A";
    document.getElementById("annual_ghi").textContent = "N/A";
    console.log("no data bruh");
  } else {
    document.getElementById("hidden").style.display = "none";
  }

  if (chart_id == "avg_dni_graph") {
    document.getElementById("annual_dni").textContent = data["outputs"][chart_id.substring(0, chart_id.length - 6)]["annual"];
  }
  if (chart_id == "avg_ghi_graph") {
    document.getElementById("annual_ghi").textContent = data["outputs"][chart_id.substring(0, chart_id.length - 6)]["annual"];
  }
  if (chart_id == "avg_lat_tilt_graph") {
    document.getElementById("annual_lat_tilt").textContent = data["outputs"][chart_id.substring(0, chart_id.length - 6)]["annual"];
  }

  const month = [];
  const solar_data = [];
  console.log(data["outputs"][chart_id.substring(0, chart_id.length - 6)])
  for (let key in data["outputs"][chart_id.substring(0, chart_id.length - 6)]["monthly"]) {
    month.push(key)
    solar_data.push(data["outputs"][chart_id.substring(0, chart_id.length - 6)]["monthly"][key])
  }
  console.log(data)
  return { month, solar_data };
}
  
