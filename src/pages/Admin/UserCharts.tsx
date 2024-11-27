import { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { supabase } from '../../lib/supabaseClient';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface MonthlyData {
  [key: string]: number;
}

export function UserCharts() {
  const [userGrowth, setUserGrowth] = useState({
    labels: [] as string[],
    datasets: [{
      label: 'Novos Usuários',
      data: [] as number[],
      borderColor: 'rgb(124, 58, 237)',
      backgroundColor: 'rgba(124, 58, 237, 0.5)',
    }]
  });

  const [ageDistribution, setAgeDistribution] = useState({
    labels: [] as string[],
    datasets: [{
      data: [] as number[],
      backgroundColor: [
        'rgba(124, 58, 237, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(167, 139, 250, 0.8)',
        'rgba(196, 181, 253, 0.8)',
      ],
    }]
  });

  useEffect(() => {
    fetchUserGrowth();
    fetchAgeDistribution();
  }, []);

  const fetchUserGrowth = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at');

      if (error) throw error;

      const monthlyData: MonthlyData = {};
      data?.forEach(user => {
        const date = new Date(user.created_at);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
      });

      setUserGrowth({
        labels: Object.keys(monthlyData),
        datasets: [{
          label: 'Novos Usuários',
          data: Object.values(monthlyData),
          borderColor: 'rgb(124, 58, 237)',
          backgroundColor: 'rgba(124, 58, 237, 0.5)',
        }]
      });
    } catch (error) {
      console.error('Error fetching user growth:', error);
    }
  };

  const fetchAgeDistribution = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('age');

      if (error) throw error;

      const distribution = {
        '50-60': 0,
        '61-70': 0,
        '71-80': 0,
        '81+': 0
      };

      data?.forEach(user => {
        if (user.age) {
          if (user.age <= 60) distribution['50-60']++;
          else if (user.age <= 70) distribution['61-70']++;
          else if (user.age <= 80) distribution['71-80']++;
          else distribution['81+']++;
        }
      });

      setAgeDistribution({
        labels: Object.keys(distribution),
        datasets: [{
          data: Object.values(distribution),
          backgroundColor: [
            'rgba(124, 58, 237, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(167, 139, 250, 0.8)',
            'rgba(196, 181, 253, 0.8)',
          ],
        }]
      });
    } catch (error) {
      console.error('Error fetching age distribution:', error);
    }
  };

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Crescimento de Usuários
        </h3>
        <Line
          data={userGrowth}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
          }}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Distribuição por Idade
        </h3>
        <Pie
          data={ageDistribution}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
          }}
        />
      </div>
    </div>
  );
}