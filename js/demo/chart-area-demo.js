// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

/**
 * Obtiene la lista de estados desde el servidor.
 * @returns {Promise<Response>} Promesa que resuelve con la respuesta de la solicitud.
 */
async function listaReportesEstado(idEstado) {
  let token = localStorage.getItem("token")

  const result = await fetch(urlBasic + "/estado/" + idEstado + "/incidentes", {
    headers: {
      "Content-type": "application/json",
      "Authorization": "Bearer " + token
    }

  })
  return result;
}


// Obtener el elemento canvas con el ID "myAreaChart"
var ctx = document.getElementById("myAreaChart");

// Función para generar el gráfico
function generarGrafico(meses, ingresos,valMax) {

  // Crear una instancia de Chart y asignarla a la variable myLineChart
  var myLineChart = new Chart(ctx, {
    type: 'line',  // Tipo de gráfico: línea
    data: {
      labels: meses,  // Etiquetas en el eje x (meses)
      datasets: [{
        label: "Incidentes",  // Etiqueta de la serie de datos
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: ingresos,  // Datos de ingresos en el eje y
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'date'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: meses.length
          }
        }],

        yAxes: [{
          ticks: {
            maxTicksLimit: 6,
            padding: 10,
            min: 0,  // Valor mínimo
            max: valMax,  // Valor máximo
            callback: function (value, index, values) {
              return '$' + number_format(value);
            }
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10,
        callbacks: {
          label: function (tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
          }
        }
      }
    }
  });
}
function listaIncidenteActivosEstadistica() {
  listaReportesEstado(1)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      // Obtener la lista de incidentes
      var incidentes = data;

      // Crear un objeto para almacenar el número de incidentes por mes
      var incidentesPorMes = {};

      // Recorrer el arreglo de incidentes y contar los incidentes por mes
      incidentes.forEach(function (incidente) {
        // Obtener el mes del incidente (puedes utilizar alguna propiedad de fecha si está disponible)
        var fecha = new Date(incidente.fechaRegistro); // Suponiendo que hay una propiedad "fechaRegistro" en el objeto incidente

        // Obtener el mes y el año del incidente (en formato 'MMM-yyyy')
        var mesAnio = fecha.toLocaleString('default', { month: 'short', year: 'numeric' });

        // Si el mes aún no está en el objeto incidentesPorMes, inicializarlo en 1
        if (!incidentesPorMes[mesAnio]) {
          incidentesPorMes[mesAnio] = 1;
        } else {
          // Si el mes ya está en el objeto incidentesPorMes, incrementar el contador en 1
          incidentesPorMes[mesAnio]++;
        }
      });

      // Crear un arreglo de ingresos por mes a partir del objeto incidentesPorMes
      let meses = [];
      let ingresos = [];

      // Recorrer todos los meses desde enero hasta diciembre
      for (var i = 0; i < 12; i++) {
        var mesAnio = new Date(2023, i).toLocaleString('default', { month: 'short', year: 'numeric' });

        // Verificar si el mes actual no está en el objeto incidentesPorMes
        if (!incidentesPorMes[mesAnio]) {
          // Agregar el mes faltante al arreglo de meses
          meses.push(mesAnio);

          // Agregar 0 al arreglo de ingresos
          ingresos.push(0);
        } else {
          // Si el mes está en el objeto incidentesPorMes, obtener el número de incidentes
          var numeroIncidentes = incidentesPorMes[mesAnio];

          // Agregar el número de incidentes al arreglo de ingresos
          ingresos.push(numeroIncidentes);
        }
      }

      // Imprimir el resultado
      console.log(meses);
      console.log(ingresos);
      sessionStorage.setItem("ingresos", JSON.stringify(ingresos))
    })
    .catch(err => {
      console.log(err)

    })
    .finally(final => {

    })

}

try {
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  
  const ingresos = JSON.parse(sessionStorage.getItem("ingresos"));
  const valMax = Math.max(...ingresos);
  
  
  generarGrafico(meses, ingresos,valMax);
} catch (error) {

}
// var meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
// var ingresos = [10000, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000];

// generarGrafico(meses, ingresos);

