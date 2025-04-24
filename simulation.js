// Script para la simulación interactiva de Sistema de Inventario

document.addEventListener('DOMContentLoaded', function() {
  console.log('Inicializando simulación...');
  
  // Verificar si Chart.js está disponible
  if (typeof Chart === 'undefined') {
    console.error('Chart.js no está cargado. La simulación no funcionará correctamente.');
    
    // Intentar cargar Chart.js dinámicamente si no está presente
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = function() {
      console.log('Chart.js cargado dinámicamente');
      initSimulation();
    };
    script.onerror = function() {
      console.error('No se pudo cargar Chart.js. Por favor refresca la página o intenta más tarde.');
      alert('No se pudo cargar la biblioteca de gráficos. Por favor refresca la página.');
    };
    document.head.appendChild(script);
    return;
  }
  
  // Función principal de inicialización
  function initSimulation() {
    const simulationModal = document.getElementById('simulation-modal');
    if (!simulationModal) return;            // si no hay modal, salir silencioso
    simulationModal.style.display = 'none';
    
    // solo configurar si existe el botón
    const simulationBtn = document.getElementById('showSimulation');
    if (simulationBtn) {
      simulationBtn.addEventListener('click', function(e) {
        e.preventDefault();
        simulationModal.style.display = 'flex';
        simulationModal.classList.remove('hidden');
      });
    }
    
    // cierre del modal
    const closeBtn = document.querySelector('.close-simulation');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        simulationModal.style.display = 'none';
        simulationModal.classList.add('hidden');
      });
    }
    
    simulationModal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.style.display = 'none';
        this.classList.add('hidden');
      }
    });
    
    // Configurar botón de recursos
    const downloadBtn = document.getElementById('downloadResources');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Los recursos de modelado estarán disponibles próximamente. Estamos trabajando en ello.');
      });
    }
  }
  
  function initSimControls() {
    const sliders = document.querySelectorAll('.simulation-controls input[type="range"]');
    
    sliders.forEach(slider => {
      const valueDisplay = slider.nextElementSibling;
      
      slider.addEventListener('input', function() {
        valueDisplay.textContent = this.value;
      });
    });
    
    const runButton = document.getElementById('runSimulation');
    if (runButton) {
      runButton.addEventListener('click', function() {
        const coverageTime = parseFloat(document.getElementById('coverageTime').value);
        const adjustTime = parseFloat(document.getElementById('adjustTime').value);
        
        runSimulation(coverageTime, adjustTime);
      });
      
      // Ejecutar simulación inicial
      setTimeout(() => {
        console.log('Ejecutando simulación inicial');
        runButton.click();
      }, 500);
    }
  }
  
  function runSimulation(coverageTime, adjustTime) {
    const canvas = document.getElementById('simulationChart');
    
    if (!canvas) {
      console.error('No se encontró el canvas para la simulación');
      return;
    }
    
    if (!window.Chart) {
      console.error('Chart.js no está disponible');
      return;
    }
    
    // Destruir gráfico existente si hay uno
    if (window.simulationChart) {
      window.simulationChart.destroy();
    }
    
    console.log('Ejecutando simulación con parámetros:', {coverageTime, adjustTime});
    
    // Simular datos básicos
    const weeks = 52;
    const initialInventory = 100;
    const expectedSales = 10;
    
    // Crear arrays para almacenar los resultados de la simulación
    const inventoryLevels = [initialInventory];
    const productionRates = [];
    const salesRates = [];
    const labels = ['Semana 0'];
    
    let currentInventory = initialInventory;
    
    // Modelo simple de simulación
    for (let week = 1; week <= weeks; week++) {
      labels.push(`Semana ${week}`);
      
      // Calcular ventas con una pequeña variación aleatoria
      const sales = expectedSales * (0.9 + 0.2 * Math.random());
      salesRates.push(sales);
      
      // Calcular producción según el modelo
      const desiredInventory = expectedSales * coverageTime;
      const inventoryGap = desiredInventory - currentInventory;
      const production = Math.max(0, expectedSales + inventoryGap / adjustTime);
      productionRates.push(production);
      
      // Actualizar inventario
      currentInventory += production - sales;
      inventoryLevels.push(currentInventory);
    }
    
    // Añadir null al principio para alinear con inventoryLevels
    productionRates.unshift(null);
    salesRates.unshift(null);
    
    // Crear gráfico con Chart.js
    try {
      window.simulationChart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Inventario',
              data: inventoryLevels,
              borderColor: '#0077aa',
              backgroundColor: 'rgba(0,119,170,0.1)',
              borderWidth: 2,
              fill: true
            },
            {
              label: 'Producción',
              data: productionRates,
              borderColor: '#28a745',
              borderWidth: 2,
              borderDash: [5, 5],
              fill: false
            },
            {
              label: 'Ventas',
              data: salesRates,
              borderColor: '#dc3545',
              borderWidth: 2,
              borderDash: [3, 3],
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          }
        }
      });
      console.log('Gráfico creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico:', error);
    }
  }
  
  // Solo intentar inicializar si se carga Chart.js
  try {
    if (typeof initSimulation === 'function') initSimulation();
  } catch (error) {
    console.error('Error al inicializar la simulación:', error);
  }
});
