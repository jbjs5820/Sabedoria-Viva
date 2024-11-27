import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { UserStats } from './UserStats';
import { UserCharts } from './UserCharts';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard Administrativo</h1>
            <p className="mt-2 text-sm text-gray-700">
              Visão geral das estatísticas e métricas da plataforma.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <UserStats />
        </div>

        <div className="mt-8">
          <UserCharts />
        </div>
      </div>
    </AdminLayout>
  );
}