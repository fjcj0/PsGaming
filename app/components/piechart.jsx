import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
const PieChart = ({ data }) => {
    const labels = data.map(item => item.name);
    const ratingData = data.map(item => item.rate);
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Top 5 Rated Games',
                data: ratingData,
                backgroundColor: [
                    '#FF5733', '#33B5FF', '#FFEB33', '#8E44AD', '#2ECC71',
                ],
                hoverOffset: 4,
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`; // Format tooltip
                    },
                },
            },
        },
    };
    return <Pie data={chartData} options={options} />;
};
export default PieChart;