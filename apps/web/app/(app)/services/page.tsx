'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import Link from 'next/link';
import { ServiceStatus } from '@pulse-monitor/shared';

interface Service {
  id: string;
  name: string;
  baseUrl: string;
  healthPath: string;
  intervalSec: number;
  lastStatus?: ServiceStatus;
  lastLatencyMs?: number;
  enabled: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await api.get<Service[]>('/services');
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await api.delete(`/services/${id}`);
      loadServices();
    } catch (error) {
      alert('Failed to delete service');
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <Link
            href="/services/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Service
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {services.map((service) => (
              <li key={service.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div
                      className={`h-3 w-3 rounded-full mr-3 ${
                        service.lastStatus === ServiceStatus.UP
                          ? 'bg-green-500'
                          : service.lastStatus === ServiceStatus.DOWN
                          ? 'bg-red-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">
                        {service.baseUrl}
                        {service.healthPath}
                      </p>
                      <p className="text-xs text-gray-400">
                        Check every {service.intervalSec}s •{' '}
                        {service.enabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {service.lastLatencyMs && (
                      <span className="text-sm text-gray-600">{service.lastLatencyMs}ms</span>
                    )}
                    <Link
                      href={`/services/${service.id}`}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}

