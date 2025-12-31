'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';

interface AlertEvent {
  id: string;
  serviceId: string;
  triggeredAt: string;
  message: string;
  service: {
    id: string;
    name: string;
  };
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await api.get<AlertEvent[]>('/alerts');
      setAlerts(data);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Alerts</h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No alerts</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {alerts.map((alert) => (
                <li key={alert.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-500">
                        Service: {alert.service.name} •{' '}
                        {new Date(alert.triggeredAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Alert
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}

