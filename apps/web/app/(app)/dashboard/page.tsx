'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import Link from 'next/link';
import { ServiceStatus } from '@pulse-monitor/shared';

interface Summary {
  totalServices: number;
  upCount: number;
  downCount: number;
  avgLatencyMs: number;
}

interface Service {
  id: string;
  name: string;
  baseUrl: string;
  lastStatus?: ServiceStatus;
  lastLatencyMs?: number;
  lastCheckedAt?: string;
  enabled: boolean;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [summaryData, servicesData] = await Promise.all([
        api.get<Summary>('/dashboard/summary'),
        api.get<Service[]>('/services'),
      ]);
      setSummary(summaryData);
      setServices(servicesData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {summary && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-gray-900">{summary.totalServices}</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <div className="text-sm font-medium text-gray-500">Total Services</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-green-600">{summary.upCount}</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <div className="text-sm font-medium text-gray-500">Up</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-red-600">{summary.downCount}</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <div className="text-sm font-medium text-gray-500">Down</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-gray-900">
                      {summary.avgLatencyMs}ms
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <div className="text-sm font-medium text-gray-500">Avg Latency</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Services</h3>
            <Link
              href="/services/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Service
            </Link>
          </div>
          <ul className="divide-y divide-gray-200">
            {services.map((service) => (
              <li key={service.id}>
                <Link
                  href={`/services/${service.id}`}
                  className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`h-3 w-3 rounded-full mr-3 ${
                          service.lastStatus === ServiceStatus.UP
                            ? 'bg-green-500'
                            : service.lastStatus === ServiceStatus.DOWN
                            ? 'bg-red-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500">{service.baseUrl}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {service.lastLatencyMs && (
                        <p className="text-sm text-gray-900">{service.lastLatencyMs}ms</p>
                      )}
                      {service.lastCheckedAt && (
                        <p className="text-xs text-gray-500">
                          {new Date(service.lastCheckedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}

