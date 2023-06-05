// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function generarGraficoDona(labels, data, backgroundColor, hoverBackgroundColor, hoverBorderColor) {
  var ctx = document.getElementById("myPieChart");
  var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: hoverBackgroundColor,
        hoverBorderColor: hoverBorderColor,
      }],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: true, // Cambiar a true para mostrar la leyenda
        position: 'bottom', // Cambiar la posición de la leyenda (top, bottom, left, right)
      },
      cutoutPercentage: 0, // Cambiar el porcentaje de corte para un gráfico de dona (0 para un gráfico de pastel completo)
    },
  });
}

// Ejemplo de uso:
var labels = ["Directo", "Referencia", "Casa","Directo", "Referencia", "Casa"];
var data = [10,20,10,10,20,30];
var backgroundColor = ['#4e73df', '#1cc88a', '#36b9cc','#4e73df', '#1cc88a', '#36b9cc',];
var hoverBackgroundColor = ['#2e59d9', '#17a673', '#2c9faf','#2e59d9', '#17a673', '#2c9faf'];
var hoverBorderColor = "rgba(234, 236, 244, 1)";

generarGraficoDona(labels, data, backgroundColor, hoverBackgroundColor, hoverBorderColor);

