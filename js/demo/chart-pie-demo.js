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
      responsive: true, // Hacer el gráfico responsive al tamaño del contenedor
      maintainAspectRatio: false,
      animation: {
        animateRotate: true, // Agregar animación de rotación
        animateScale: true, // Agregar animación de escala
      },
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

try {
  function verTableRedonda() {
    let incidentes = JSON.parse(sessionStorage.getItem("lista"))


    // Crear un objeto para almacenar la cuenta de categorías
    var categoriasCount = {};

    // Contar la cantidad de incidentes por categoría
    incidentes.forEach(function (incidente) {
      var categoria = incidente.categoriaId;
      if (categoria && categoria.nombre) {
        if (!categoriasCount[categoria.nombre]) {
          categoriasCount[categoria.nombre] = 1;
        } else {
          categoriasCount[categoria.nombre]++;
        }
      }
    });

    // Crear los arrays de labels y porcentajes
    var labels = [];
    var data = [];
    var totalIncidentes = incidentes.length;

    // Recorrer las categorías y calcular los porcentajes
    for (var categoriaNombre in categoriasCount) {
      if (categoriasCount.hasOwnProperty(categoriaNombre)) {
        var porcentaje = (categoriasCount[categoriaNombre] / totalIncidentes) * 100;
        labels.push(categoriaNombre);
        data.push(porcentaje);
      }
    }

    // Verificar la suma de porcentajes y ajustar si es necesario
    var sumaPorcentajes = data.reduce(function (total, porcentaje) {
      return total + porcentaje;
    }, 0);

    if (sumaPorcentajes !== 100) {
      var diferencia = 100 - sumaPorcentajes;
      var ultimoPorcentaje = data[data.length - 1];
      data[data.length - 1] += diferencia;
    }

    // Ejemplo de uso:
    var backgroundColor = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'];
    var hoverBackgroundColor = ['#2e59d9', '#17a673', '#2c9faf', '#dda20a', '#b5352b', '#6e7d8e', '#2e59d9', '#17a673', '#2c9faf', '#dda20a'];

    var hoverBorderColor = "rgba(234, 236, 244, 1)";

    generarGraficoDona(labels, data, backgroundColor, hoverBackgroundColor, hoverBorderColor);
  }
} catch (error) {


}


