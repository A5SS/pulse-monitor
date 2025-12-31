'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';

export default function NewServicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    baseUrl: '',
    healthPath: '/health',
    method: 'GET',
    expectedStatus: 200,
    timeoutMs: 5000,
    intervalSec: 60,
    enabled: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/services', formData);
      router.push('/services');
    } catch (err: any) {
      setError(err.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">New Service</h1>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Base URL</label>
            <input
              type="url"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.baseUrl}
              onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Health Path</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.healthPath}
              onChange={(e) => setFormData({ ...formData, healthPath: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Method</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              >
                <option>GET</option>
                <option>POST</option>
                <option>HEAD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Expected Status</label>
              <input
                type="number"
                required
                min="100"
                max="599"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.expectedStatus}
                onChange={(e) =>
                  setFormData({ ...formData, expectedStatus: parseInt(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Timeout (ms)</label>
              <input
                type="number"
                required
                min="1000"
                max="60000"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.timeoutMs}
                onChange={(e) =>
                  setFormData({ ...formData, timeoutMs: parseInt(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Interval (seconds)</label>
              <input
                type="number"
                required
                min="10"
                max="3600"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.intervalSec}
                onChange={(e) =>
                  setFormData({ ...formData, intervalSec: parseInt(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
            />
            <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
              Enabled
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

