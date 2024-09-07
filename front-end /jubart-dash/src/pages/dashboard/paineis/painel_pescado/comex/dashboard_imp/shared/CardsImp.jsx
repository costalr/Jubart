import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import 'chart.js/auto'; // Importação necessária para o funcionamento do Chart.js
import '../../shared/Cards.css';

const CardsImp = ({ importData, referenceMonth, referenceYear, selectedCountry }) => {
    const [isYearViewVolume, setIsYearViewVolume] = useState(true); // Estado para o gráfico de volume
    const [isYearViewRevenue, setIsYearViewRevenue] = useState(true); // Estado para o gráfico de receita
    const [isYearViewPrice, setIsYearViewPrice] = useState(true); // Estado para o gráfico de preço médio
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    // Opções do gráfico sem grades e legendas, com apenas a linha visível
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false, // Remove as linhas de grade no eixo X
                    drawBorder: false, // Remove a linha do eixo X
                    drawOnChartArea: false, // Garante que nenhuma linha seja desenhada
                    drawTicks: false, // Remove os ticks
                },
                ticks: {
                    display: false, // Remove os rótulos do eixo X
                },
            },
            y: {
                grid: {
                    display: false, // Remove as linhas de grade no eixo Y
                    drawBorder: false, // Remove a linha do eixo X
                    drawOnChartArea: false, // Garante que nenhuma linha seja desenhada
                    drawTicks: false, // Remove os ticks
                },
                ticks: {
                    display: false, // Remove os rótulos do eixo Y
                },
            },
        },
        plugins: {
            legend: {
                display: false, // Remove a legenda
            },
        },
        elements: {
            line: {
                borderColor: '#007bff', // Cor da linha
                borderWidth: 1.5, // Espessura da linha
                fill: false, // Remove o preenchimento
            },
            point: {
                radius: 2, // Tamanho dos pontos
                backgroundColor: '#007bff', // Cor dos pontos
            },
        },
    };
    

    // Função para calcular métricas (Volume, Receita e Preço Médio)
    const calculateMetrics = (data, year, month, country = null) => {
        const filterDataForYear = (data, year) => 
            data.filter(d => 
                parseInt(d.ano) === year && 
                parseInt(d.mes) <= month && 
                d.total_kg !== 'none' && 
                d.total_usd !== 'none' && 
                (!country || d.pais === country)
            );

        const currentYearData = filterDataForYear(data, year);
        const previousYearData = filterDataForYear(data, year - 1);

        const sumMetrics = (data, metric) => data.reduce((sum, item) => sum + parseFloat(item[metric]), 0);

        const currentVolume = sumMetrics(currentYearData, 'total_kg');
        const previousVolume = sumMetrics(previousYearData, 'total_kg');
        const currentRevenue = sumMetrics(currentYearData, 'total_usd');
        const previousRevenue = sumMetrics(previousYearData, 'total_usd');

        const volumeChange = previousVolume ? ((currentVolume - previousVolume) / previousVolume * 100).toFixed(2) : 'N/A';
        const revenueChange = previousRevenue ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(2) : 'N/A';

        const currentAveragePrice = currentVolume ? (currentRevenue / currentVolume).toFixed(2) : '0.00';
        const previousAveragePrice = previousVolume ? (previousRevenue / previousVolume).toFixed(2) : '0.00';
        const averagePriceChange = previousAveragePrice ? (((currentAveragePrice - previousAveragePrice) / previousAveragePrice) * 100).toFixed(2) : 'N/A';

        return {
            volume: (currentVolume / 1000).toLocaleString('pt-BR'), // Convertendo para toneladas
            revenue: currentRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' }),
            averagePrice: parseFloat(currentAveragePrice).toLocaleString('pt-BR', { style: 'currency', currency: 'USD' }) + "/t",
            volumeChange,
            revenueChange,
            averagePriceChange
        };
    };

    const getLast5YearsData = (metric) => {
        const years = [];
        for (let i = 0; i < 5; i++) {
            years.push(referenceYear - i);
        }
        const currentMetric = years.map(year => {
            const yearData = importData.filter(item => parseInt(item.ano) === year);
    
            if (metric === 'average_price') {
                const yearRevenue = yearData.reduce((sum, item) => sum + (parseFloat(item.total_usd) || 0), 0);
                const yearVolume = yearData.reduce((sum, item) => sum + (parseFloat(item.total_kg) || 0), 0);
                return yearVolume === 0 ? 0 : yearRevenue / yearVolume; // Cálculo do preço médio
            }
    
            // Para Volume ou Receita, apenas somamos os valores
            return yearData.reduce((sum, item) => sum + (parseFloat(item[metric]) || 0), 0) / 1000;
        });
        return {
            labels: years.reverse(),
            datasets: [
                {
                    label: metric === 'total_kg' ? 'Volume' : metric === 'total_usd' ? 'Receita' : 'Preço Médio',
                    data: currentMetric.reverse(), // Inverte a ordem dos dados para exibir corretamente
                    borderColor: metric === 'total_kg' ? '#42A5F5' : metric === 'total_usd' ? '#66BB6A' : '#FFA726',
                    fill: false,
                },
            ],
        };
    };

    // Função para gerar dados para o gráfico dos últimos meses do ano corrente
    const getCurrentYearData = (metric) => {
        const months = monthNames.slice(0, referenceMonth);
        const currentMetric = months.map((month, index) => {
            const monthData = importData.filter(item => parseInt(item.ano) === referenceYear && parseInt(item.mes) === index + 1);
            
            // Cálculo de Preço Médio (Receita / Volume)
            if (metric === 'average_price') {
                const revenue = monthData.reduce((sum, item) => sum + (parseFloat(item.total_usd) || 0), 0);
                const volume = monthData.reduce((sum, item) => sum + (parseFloat(item.total_kg) || 0), 0);
                return volume === 0 ? 0 : revenue / volume; // Evitar divisão por zero
            }
            
            // Para Volume ou Receita, apenas somamos os valores
            return monthData.reduce((sum, item) => sum + (parseFloat(item[metric]) || 0), 0) / 1000;
        });
        return {
            labels: months,
            datasets: [
                {
                    label: metric === 'total_kg' ? 'Volume' : metric === 'total_usd' ? 'Receita' : 'Preço Médio',
                    data: currentMetric,
                    borderColor: metric === 'total_kg' ? '#42A5F5' : metric === 'total_usd' ? '#66BB6A' : '#FFA726',
                    fill: false,
                },
            ],
        };
    };

    if (!importData.length || referenceMonth === null || referenceYear === null) {
        return <div>Loading...</div>;
    }

    const metrics = calculateMetrics(importData, referenceYear, referenceMonth, selectedCountry);

    // Função para exibir a seta de acordo com a variação
    const renderChange = (value) => (
        <span className={`change ${value >= 0 ? 'positive' : 'negative'}`}>
            {value >= 0 ? <ArrowUpward className="arrow" /> : <ArrowDownward className="arrow" />}
            {Math.abs(value)}%
        </span>
    );

    return (
        <div className="imp-container">
            <h1>{selectedCountry ? `${selectedCountry} - ` : ''}{monthNames[referenceMonth - 1]} de {referenceYear}</h1>
            <div className="cards-container">

                {/* Container para o Volume */}
                <div className="card-imp">
                    <h3>Volume de Importação</h3>
                    <p className="main-value">{metrics.volume} t</p>
                    {renderChange(metrics.volumeChange)}

                    {/* Botões para alternar entre visualização por ano e por mês */}
                    <div className="view-toggle">
                        <button onClick={() => setIsYearViewVolume(true)} className={isYearViewVolume ? 'active' : ''}>Ano</button>
                        <button onClick={() => setIsYearViewVolume(false)} className={!isYearViewVolume ? 'active' : ''}>Mês</button>
                    </div>

                    {/* Gráfico de linha para os últimos 5 anos ou últimos meses */}
                    <div className="cards-imp-chart-container">
                        {isYearViewVolume ? (
                            <Line 
                                data={getLast5YearsData('total_kg')} 
                                options={chartOptions}
                            />
                        ) : (
                            <Line 
                                data={getCurrentYearData('total_kg')} 
                                options={chartOptions}
                            />
                        )}
                    </div>
                </div>

                {/* Container para a Receita */}
                <div className="card-imp">
                    <h3>Receita de Importação</h3>
                    <p className="main-value">{metrics.revenue}</p>
                    {renderChange(metrics.revenueChange)}

                    {/* Botões para alternar entre visualização por ano e por mês */}
                    <div className="view-toggle">
                        <button onClick={() => setIsYearViewRevenue(true)} className={isYearViewRevenue ? 'active' : ''}>Ano</button>
                        <button onClick={() => setIsYearViewRevenue(false)} className={!isYearViewRevenue ? 'active' : ''}>Mês</button>
                    </div>

                    {/* Gráfico de linha para os últimos 5 anos ou últimos meses */}
                    <div className="cards-imp-chart-container">
                        {isYearViewRevenue ? (
                            <Line 
                                data={getLast5YearsData('total_usd')} 
                                options={chartOptions}
                            />
                        ) : (
                            <Line 
                                data={getCurrentYearData('total_usd')} 
                                options={chartOptions}
                            />
                        )}
                    </div>
                </div>

                {/* Container para o Preço Médio */}
                <div className="card-imp midprice-card">
                    <h3>Preço Médio de Importação</h3>
                    <p className="main-value">{metrics.averagePrice}</p>
                    {renderChange(metrics.averagePriceChange)}

                    {/* Botões para alternar entre visualização por ano e por mês */}
                    <div className="view-toggle">
                        <button onClick={() => setIsYearViewPrice(true)} className={isYearViewPrice ? 'active' : ''}>Ano</button>
                        <button onClick={() => setIsYearViewPrice(false)} className={!isYearViewPrice ? 'active' : ''}>Mês</button>
                    </div>

                    {/* Gráfico de linha para os últimos 5 anos ou últimos meses */}
                    <div className="cards-imp-chart-container midprice-chart">
                        {isYearViewPrice ? (
                            <Line 
                                data={getLast5YearsData('average_price')} 
                                options={chartOptions}
                            />
                        ) : (
                            <Line 
                                data={getCurrentYearData('average_price')} 
                                options={chartOptions}
                            />
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CardsImp;
