'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { ServiceStatus } from '@pulse-monitor/shared';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Service {
  id: string;
  name: string;
  baseUrl: string;
  healthPath: string;
  lastStatus?: ServiceStatus;
  lastLatencyMs?: number;
  checkRuns: Array<{
    id: string;
    timestamp: string;
    status: ServiceStatus;
    latencyMs?: number;
    statusCode?: number;
    errorMessage?: string;
  }>;
}

interface Metric {
  timestamp: string;
  status: ServiceStatus;
  latencyMs: number;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id as string;
  const [service, setService] = useState<Service | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('15m');

  useEffect(() => {
    if (serviceId) {
      loadService();
      loadMetrics();
    }
  }, [serviceId, range]);

  const loadService = async () => {
    try {
      const data = await api.get<Service>(`/services/${serviceId}`);
      setService(data);
    } catch (error) {
      console.error('Failed to load service:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      const data = await api.get<Metric[]>(`/dashboard/services/${serviceId}/metrics?range=${range}`);
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
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

  if (!service) {
    return (
      <Layout>
        <div className="text-center text-gray-500">Service not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
          <p className="text-sm text-gray-500">
            {service.baseUrl}
            {service.healthPath}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div
                className={`h-4 w-4 rounded-full mr-3 ${
                  service.lastStatus === ServiceStatus.UP
                    ? 'bg-green-500'
                    : service.lastStatus === ServiceStatus.DOWN
                    ? 'bg-red-500'
                    : 'bg-gray-300'
                }`}
              />
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-lg font-semibold text-gray-900">
                  {service.lastStatus || 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-sm font-medium text-gray-500">Latency</p>
            <p className="text-lg font-semibold text-gray-900">
              {service.lastLatencyMs ? `${service.lastLatencyMs}ms` : 'N/A'}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-sm font-medium text-gray-500">Recent Checks</p>
            <p className="text-lg font-semibold text-gray-900">{service.checkRuns.length}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Metrics</h2>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="15m">Last 15 minutes</option>
              <option value="1h">Last hour</option>
              <option value="24h">Last 24 hours</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number) => [`${value}ms`, 'Latency']}
              />
              <Line type="monotone" dataKey="latencyMs" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Checks</h3>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Latency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Error
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {service.checkRuns.map((run) => (
                  <tr key={run.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(run.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          run.status === ServiceStatus.UP
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {run.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {run.latencyMs ? `${run.latencyMs}ms` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {run.statusCode || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {run.errorMessage || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

