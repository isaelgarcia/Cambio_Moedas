import React, { useEffect, useState } from 'react';
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSelect, IonSelectOption, IonButton, IonInput,} from '@ionic/react';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,} from 'chart.js';
import './Tab3.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Tab3: React.FC = () => {
  const [baseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('BRL');
  const [chartData, setChartData] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const apiKey = '41942ff5d5cd4e3982db2a1e5edb8694';

  const generateDateIntervals = (start: string, end: string, intervalMonths: number) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates = [];
  
    if (startDate > endDate) {
      console.error("Data de início não pode ser maior que a data de fim.");
      return [];
    }
  
    while (startDate <= endDate) {
      const year = startDate.getFullYear();
      const month = startDate.getMonth() + 1;
      const day = startDate.getDate();
  
      dates.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  
      const nextMonth = startDate.getMonth() + intervalMonths;
      startDate.setMonth(nextMonth);
  
      if (startDate.getDate() !== day) {
        startDate.setDate(0);
      }
    }
  
    console.log("Datas geradas:", dates);
    return dates;
  };

  const fetchHistoricalRates = async () => {
    if (!startDate || !endDate) {
      console.error("Por favor, defina as datas de início e fim.");
      return;
    }
  
    const diffInYears = (new Date(endDate).getFullYear() - new Date(startDate).getFullYear());
    const intervalMonths = diffInYears >= 4 ? 4 : diffInYears === 3 ? 3 : diffInYears === 2 ? 2 : 1;
  
    const dateIntervals = generateDateIntervals(startDate, endDate, intervalMonths);
  
    if (dateIntervals.length === 0) {
      console.error("Nenhuma data válida foi gerada.");
      return;
    }
  
    try {
      const rates = [];
      const labels = [];
  
      for (const date of dateIntervals) {
        const url = `https://openexchangerates.org/api/historical/${date}.json?app_id=${apiKey}&symbols=${targetCurrency}&base=${baseCurrency}`;
        console.log(`Buscando dados para ${date}: ${url}`);
  
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`Erro na requisição para ${date}: ${response.statusText}`);
          continue;
        }
  
        const data = await response.json();
        if (data.rates && data.rates[targetCurrency]) {
          labels.push(date);
          rates.push(data.rates[targetCurrency]);
        }
      }
  
      if (!labels.includes(endDate)) {
        const finalDateUrl = `https://openexchangerates.org/api/historical/${endDate}.json?app_id=${apiKey}&symbols=${targetCurrency}&base=${baseCurrency}`;
        const finalResponse = await fetch(finalDateUrl);
  
        if (finalResponse.ok) {
          const finalData = await finalResponse.json();
          if (finalData.rates && finalData.rates[targetCurrency]) {
            labels.push(endDate);
            rates.push(finalData.rates[targetCurrency]);
          }
        }
      }
  
      setChartData({
        labels,
        datasets: [
          {
            label: `${baseCurrency} → ${targetCurrency} Taxa de Câmbio`,
            data: rates,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      console.error("Erro ao buscar dados históricos:", error);
    }
  };  

  useEffect(() => {
    if (startDate && endDate) {
      fetchHistoricalRates();
    }
  }, [baseCurrency, targetCurrency, startDate, endDate]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gráficos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSelect value={baseCurrency} disabled>
          <IonSelectOption value="USD">USD</IonSelectOption>
        </IonSelect>

        <IonSelect
          value={targetCurrency}
          onIonChange={(e) => setTargetCurrency(e.detail.value)}
        >
          <IonSelectOption value="AED">AED</IonSelectOption>
          <IonSelectOption value="ARS">ARS</IonSelectOption>
          <IonSelectOption value="AUD">AUD</IonSelectOption>
          <IonSelectOption value="BGN">BGN</IonSelectOption>
          <IonSelectOption value="BRL">BRL</IonSelectOption>
          <IonSelectOption value="BSD">BSD</IonSelectOption>
          <IonSelectOption value="CAD">CAD</IonSelectOption>
          <IonSelectOption value="CHF">CHF</IonSelectOption>
          <IonSelectOption value="CLP">CLP</IonSelectOption>
          <IonSelectOption value="CNY">CNY</IonSelectOption>
          <IonSelectOption value="COP">COP</IonSelectOption>
          <IonSelectOption value="CZK">CZK</IonSelectOption>
          <IonSelectOption value="DKK">DKK</IonSelectOption>
          <IonSelectOption value="DOP">DOP</IonSelectOption>
          <IonSelectOption value="EGP">EGP</IonSelectOption>
          <IonSelectOption value="EUR">EUR</IonSelectOption>
          <IonSelectOption value="FJD">FJD</IonSelectOption>
          <IonSelectOption value="GBP">GBP</IonSelectOption>
          <IonSelectOption value="GTQ">GTQ</IonSelectOption>
          <IonSelectOption value="HKD">HKD</IonSelectOption>
          <IonSelectOption value="HRK">HRK</IonSelectOption>
          <IonSelectOption value="HUF">HUF</IonSelectOption>
          <IonSelectOption value="IDR">IDR</IonSelectOption>
          <IonSelectOption value="ILS">ILS</IonSelectOption>
          <IonSelectOption value="INR">INR</IonSelectOption>
          <IonSelectOption value="ISK">ISK</IonSelectOption>
          <IonSelectOption value="JPY">JPY</IonSelectOption>
          <IonSelectOption value="KRW">KRW</IonSelectOption>
          <IonSelectOption value="KZT">KZT</IonSelectOption>
          <IonSelectOption value="MXN">MXN</IonSelectOption>
          <IonSelectOption value="MYR">MYR</IonSelectOption>
          <IonSelectOption value="NOK">NOK</IonSelectOption>
          <IonSelectOption value="NZD">NZD</IonSelectOption>
          <IonSelectOption value="PAB">PAB</IonSelectOption>
          <IonSelectOption value="PEN">PEN</IonSelectOption>
          <IonSelectOption value="PHP">PHP</IonSelectOption>
          <IonSelectOption value="PKR">PKR</IonSelectOption>
          <IonSelectOption value="PLN">PLN</IonSelectOption>
          <IonSelectOption value="PYG">PYG</IonSelectOption>
          <IonSelectOption value="RON">RON</IonSelectOption>
          <IonSelectOption value="RUB">RUB</IonSelectOption>
          <IonSelectOption value="SAR">SAR</IonSelectOption>
          <IonSelectOption value="SEK">SEK</IonSelectOption>
          <IonSelectOption value="SGD">SGD</IonSelectOption>
          <IonSelectOption value="THB">THB</IonSelectOption>
          <IonSelectOption value="TRY">TRY</IonSelectOption>
          <IonSelectOption value="TWD">TWD</IonSelectOption>
          <IonSelectOption value="UAH">UAH</IonSelectOption>
          <IonSelectOption value="USD">USD</IonSelectOption>
          <IonSelectOption value="UYU">UYU</IonSelectOption>
          <IonSelectOption value="VND">VND</IonSelectOption>
          <IonSelectOption value="ZAR">ZAR</IonSelectOption>
        </IonSelect>

        <div className="date-container">
          <IonInput
            type="date"
            value={startDate}
            onIonChange={(e) => setStartDate(e.detail.value!)}
          />
          <IonInput
            type="date"
            value={endDate}
            onIonChange={(e) => setEndDate(e.detail.value!)}
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <IonButton onClick={fetchHistoricalRates}>Atualizar taxas</IonButton>
        </div>

        {chartData ? (
          <div className="chart-container">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: {
                    display: true,
                    text: `Taxas de câmbio: USD → ${targetCurrency}`,
                  },
                },
                scales: {
                  x: {
                    type: 'category',
                    title: { display: true, text: 'Data' },
                  },
                  y: {
                    title: { display: true, text: 'Taxa de Câmbio' },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p className="loading-text">Carregando dados...</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
