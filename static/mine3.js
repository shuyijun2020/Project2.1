getData();

async function getData() {
const response = await fetch('HappinessAlcoholConsumptionSum.csv');
const data = await response.text();

const table = data.split('\n').slice(1);
table.forEach(row => {
	// console.log(row)
	const columns = row.split(',');

	const beer = columns[2];
	beerlabels.push(beer);

	const spirit = columns[3];
	spiritlabels.push(spirit);

	const wine = columns[4];
	winelabels.push(wine);

	const country = columns[0];
	xlabels.push(country);

	const happy = columns[1];
	happylabels.push(happy);

	console.log("country:", country);
	console.log("beer:", beer);
	console.log("spirit:", spirit);
	console.log("wine:", wine);
	console.log("happy:", happy);


});

}

var xlabels = [];
var beerlabels = [];
var spiritlabels = [];
var winelabels = [];
var happylabels = [];

//Chart--------------

Chart.defaults.global.elements.line.fill = false;

var myChart = {
	labels: xlabels,
       
	datasets: [{
		type: 'bar',
		label: 'Beer',
		backgroundColor: "#caf270",
		yAxisID: "y-axis-0",
		data: beerlabels,
	}, {
		type: 'bar',
		label: 'Spirits',
		backgroundColor: "#45c490",
		yAxisID: "y-axis-0",
		data: spiritlabels,
	}, {
		type: 'bar',
		label: 'Wine',
		backgroundColor: "#008d93",
		yAxisID: "y-axis-0",
		data: winelabels,
	}, 
	{
		type: 'line',
		label: 'Happiness Index',
		yAxisID: "y-axis-0",
		backgroundColor: "maroon",
		data: happylabels
	  }
],
};
	
var ctx = document.getElementById("myChart4").getContext('2d');

var ch = new Chart(ctx, {
	type: 'bar',
	data: myChart,
	options: {
		tooltips: {
			mode: 'label'
		  },
		  responsive: true,
		  scales: {
			xAxes: [{
			  stacked: true
			}],
			yAxes: [{
			  stacked: true,
			  position: "left",
			  id: "y-axis-0",
		
			}, {
			  display: false,
			  stacked: false,
			  position: "right",
			  id: "y-axis-1",
			
	        }
			]
		}
	}
}
);
