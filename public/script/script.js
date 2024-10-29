const maxDataPoints = 20; 

        const usageData = {
            labels: [],  
            datasets: [
                {
                    label: "CPU (%)",
                    data: [],
                    borderColor: "rgba(255, 99, 132, 1)",
                    fill: false
                },
                {
                    label: "RAM (%)",
                    data: [],
                    borderColor: "rgba(54, 162, 235, 1)",
                    fill: false
                },
                {
                    label: "Disque (%)",
                    data: [],
                    borderColor: "rgba(75, 192, 192, 1)",
                    fill: false
                }
            ]
        };

        const usageChart = new Chart(document.getElementById('usageChart'), {
            type: 'line',
            data: usageData,
            options: {
                scales: {
                    x: { display: false },  
                    y: { min: 0, max: 100 } 
                }
            }
        });

        async function fetchStats() {
            try {
                const response = await fetch('http://163.5.143.146:5000/api/stats');
                const data = await response.json();
                const timestamp = new Date().toLocaleTimeString();

                updateChart(usageChart, usageData, data.cpu, data.memory, data.disk, timestamp);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        }

        function updateChart(chart, data, cpuData, memoryData, diskData, label) {
            data.labels.push(label);
            data.datasets[0].data.push(cpuData);     
            data.datasets[1].data.push(memoryData);  
            data.datasets[2].data.push(diskData);   

            if (data.labels.length > maxDataPoints) {
                data.labels.shift();
                data.datasets[0].data.shift();
                data.datasets[1].data.shift();
                data.datasets[2].data.shift();
            }

            chart.update();
        }

        setInterval(fetchStats, 5000); 
        fetchStats(); 