document.addEventListener('DOMContentLoaded', function() {
            const slider = document.getElementById('bill-slider');
            const billValueEl = document.getElementById('bill-value');
            const loss1YearEl = document.getElementById('loss-1-year');
            const loss5YearsEl = document.getElementById('loss-5-years');
            const loss10YearsEl = document.getElementById('loss-10-years');
            const finalWarningEl = document.getElementById('final-warning');
            const formBillInput = document.getElementById('current-bill');

            function formatCurrency(value) {
                return new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
            }

            function updateCalculator() {
                const billValue = parseInt(slider.value);
                billValueEl.textContent = formatCurrency(billValue);
                
                loss1YearEl.textContent = formatCurrency(billValue * 12);
                loss5YearsEl.textContent = formatCurrency(billValue * 12 * 5);
                loss10YearsEl.textContent = formatCurrency(billValue * 12 * 10);
                finalWarningEl.textContent = `Você está a um passo de perder mais R$ ${formatCurrency(billValue)} no próximo mês.`;
                formBillInput.value = `R$ ${formatCurrency(billValue)}`;

                updateChart(billValue);
            }

            slider.addEventListener('input', updateCalculator);

            let savingsChart;
            function updateChart(monthlyBill) {
                const ctx = document.getElementById('savingsChart').getContext('2d');
                const years = Array.from({ length: 11 }, (_, i) => `Ano ${i}`);
                const annualUtilityCost = monthlyBill * 12;
                const annualIncreaseRate = 1.08;
                
                const utilityData = [];
                let cumulativeUtilityCost = 0;
                for (let i = 0; i < 11; i++) {
                    let currentYearCost = annualUtilityCost * Math.pow(annualIncreaseRate, i);
                    cumulativeUtilityCost += currentYearCost;
                    utilityData.push(cumulativeUtilityCost);
                }

                const paybackYears = 3.5;
                const solarSystemCost = annualUtilityCost * paybackYears;
                const solarData = [];
                for(let i = 0; i < 11; i++) {
                    if (i === 0) {
                        solarData.push(0);
                    } else if (i <= paybackYears) {
                        solarData.push(solarSystemCost / paybackYears * i);
                    } else {
                        solarData.push(solarSystemCost);
                    }
                }

                if (savingsChart) {
                    savingsChart.destroy();
                }

                savingsChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: years,
                        datasets: [
                            {
                                label: 'Custo Acumulado com Equatorial',
                                data: utilityData,
                                borderColor: 'rgb(220, 38, 38)',
                                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                                tension: 0.3,
                                fill: true,
                            },
                            {
                                label: 'Investimento Sun Energy (pago em 3.5 anos)',
                                data: solarData,
                                borderColor: 'rgb(30, 58, 138)',
                                backgroundColor: 'rgba(30, 58, 138, 0.1)',
                                tension: 0.3,
                                fill: true,
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                ticks: {
                                    callback: function(value, index, values) {
                                        return 'R$ ' + formatCurrency(value);
                                    }
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.dataset.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed.y !== null) {
                                            label += 'R$ ' + formatCurrency(context.parsed.y);
                                        }
                                        return label;
                                    }
                                }
                            }
                        }
                    }
                });
            }

            updateCalculator();
        });