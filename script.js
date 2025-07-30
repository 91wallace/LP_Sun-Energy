document.addEventListener('DOMContentLoaded', function() {
    
            // --- LÓGICA DO MENU MOBILE ---
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenuButton) {
                mobileMenuButton.addEventListener('click', function() {
                    mobileMenu.classList.toggle('hidden');
                });
            }

            // --- LÓGICA DO CARROSSEL ---
            const carouselContainer = document.getElementById('carousel-container');
            if (carouselContainer) {
                const slides = document.querySelectorAll('.carousel-slide');
                const prevBtn = document.getElementById('prev-btn');
                const nextBtn = document.getElementById('next-btn');
                const dotsContainer = document.getElementById('carousel-dots');
                let currentSlide = 0;
                let slideInterval;

                function showSlide(index) {
                    slides.forEach((slide, i) => {
                        slide.classList.remove('active');
                        if (i === index) {
                            slide.classList.add('active');
                        }
                    });
                    updateDots(index);
                }

                function updateDots(index) {
                    const dots = document.querySelectorAll('.carousel-dot');
                    dots.forEach((dot, i) => {
                        dot.classList.remove('active');
                        if (i === index) {
                            dot.classList.add('active');
                        }
                    });
                }

                function nextSlide() {
                    currentSlide = (currentSlide + 1) % slides.length;
                    showSlide(currentSlide);
                }

                function prevSlide() {
                    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                    showSlide(currentSlide);
                }

                function startSlideShow() {
                    slideInterval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
                }

                function stopSlideShow() {
                    clearInterval(slideInterval);
                }
                
                // Criar os pontos de navegação
                if (dotsContainer) {
                    slides.forEach((_, i) => {
                        const dot = document.createElement('button');
                        dot.className = 'w-3 h-3 bg-white bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-100 transition-all';
                        dot.addEventListener('click', () => {
                            currentSlide = i;
                            showSlide(i);
                            stopSlideShow();
                            startSlideShow();
                        });
                        dotsContainer.appendChild(dot);
                    });
                }


                if (nextBtn && prevBtn) {
                    nextBtn.addEventListener('click', () => {
                        nextSlide();
                        stopSlideShow();
                        startSlideShow();
                    });
                    prevBtn.addEventListener('click', () => {
                        prevSlide();
                        stopSlideShow();
                        startSlideShow();
                    });
                }

                showSlide(currentSlide);
                startSlideShow();
            }


            // --- LÓGICA DOS GRÁFICOS DA SEÇÃO DE IMPORTÂNCIA ---
            const growthChartEl = document.getElementById('growthChart');
            if (growthChartEl) {
                new Chart(growthChartEl.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: ['2020', '2021', '2022', '2023', '2024'],
                        datasets: [{
                            label: 'Capacidade Instalada (GW)',
                            data: [7.8, 13, 24, 37, 43], // Dados fictícios para ilustração
                            backgroundColor: 'rgba(30, 58, 138, 0.7)',
                            borderColor: 'rgb(30, 58, 138)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: { y: { beginAtZero: true } }
                    }
                });
            }

            const co2ChartEl = document.getElementById('co2Chart');
            if(co2ChartEl) {
                new Chart(co2ChartEl.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: ['Energia Convencional', 'Energia Solar'],
                        datasets: [{
                            label: 'Emissões de CO₂',
                            data: [100, 5], // Exemplo: Solar emite 95% menos
                            backgroundColor: ['rgb(220, 38, 38)', 'rgb(30, 58, 138)'],
                            hoverOffset: 4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            }


            // --- LÓGICA DA CALCULADORA E GRÁFICO DE ECONOMIA (Existente) ---
            const slider = document.getElementById('bill-slider');
            if (slider) {
                const billValueEl = document.getElementById('bill-value');
                const loss1YearEl = document.getElementById('loss-1-year');
                const loss5YearsEl = document.getElementById('loss-5-years');
                
                function formatCurrency(value) {
                    return new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
                }

                function updateCalculator() {
                    const billValue = parseInt(slider.value);
                    billValueEl.textContent = formatCurrency(billValue);
                    loss1YearEl.textContent = formatCurrency(billValue * 12);
                    loss5YearsEl.textContent = formatCurrency(billValue * 12 * 5);
                    updateSavingsChart(billValue);
                }

                slider.addEventListener('input', updateCalculator);

                let savingsChart;
                function updateSavingsChart(monthlyBill) {
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
                        if (i === 0) { solarData.push(0); } 
                        else if (i <= paybackYears) { solarData.push(solarSystemCost / paybackYears * i); } 
                        else { solarData.push(solarSystemCost); }
                    }

                    if (savingsChart) {
                        savingsChart.destroy();
                    }

                    savingsChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: years,
                            datasets: [
                                { label: 'Custo Acumulado com Equatorial', data: utilityData, borderColor: 'rgb(220, 38, 38)', backgroundColor: 'rgba(220, 38, 38, 0.1)', tension: 0.3, fill: true },
                                { label: 'Investimento Sun Energy (pago em 3.5 anos)', data: solarData, borderColor: 'rgb(30, 58, 138)', backgroundColor: 'rgba(30, 58, 138, 0.1)', tension: 0.3, fill: true }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: { y: { ticks: { callback: (value) => 'R$ ' + formatCurrency(value) }}},
                            plugins: { tooltip: { callbacks: { label: (context) => `${context.dataset.label}: R$ ${formatCurrency(context.parsed.y)}` }}}
                        }
                    });
                }
                updateCalculator();
            }
        });
        