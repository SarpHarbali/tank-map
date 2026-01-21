"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link'; // Ensure Link is imported if you use it, or use the <a> tag as before

export default function TankDetailPage() {
  const params = useParams();
  const tankId = params.id as string;
  
  // FIX: Added <any> and <any[]> types to state definitions
  const [tank, setTank] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tank details, job, and history
    Promise.all([
      fetch(`/api/tanks/${tankId}`).then(r => r.json()),
      fetch(`/api/tanks/${tankId}/job`).then(r => r.json()),
      fetch(`/api/tanks/${tankId}/history`).then(r => r.json())
    ]).then(([tankData, jobData, historyData]) => {
      setTank(tankData);
      setJob(jobData);
      setHistory(historyData);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading tank details:', err);
      setLoading(false);
    });
  }, [tankId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading tank details...</div>
      </div>
    );
  }

  if (!tank) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Tank not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Back to Map
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{tank.tank_number}</h1>
          <p className="text-gray-600 mt-1">Tank Container Details</p>
        </div>

        {/* Current Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Current Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium text-gray-900">{tank.canonical_place}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Coordinates</p>
              <p className="font-medium text-gray-900">{tank.lat}, {tank.lon}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Event</p>
              <p className="font-medium text-gray-900">{tank.event_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Event Time</p>
              <p className="font-medium text-gray-900">{tank.event_time || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Job Details Card */}
        {job && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Current Job</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Port of Loading</p>
                <p className="font-medium text-gray-900">{job.pol}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Port of Discharge</p>
                <p className="font-medium text-gray-900">{job.pod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Renter Company</p>
                <p className="font-medium text-gray-900">{job.renter_company || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Loaded Product</p>
                <p className="font-medium text-gray-900">{job.loaded_product || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ETA</p>
                <p className="font-medium text-gray-900">{job.eta || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium text-gray-900">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Active
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* History Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Event History</h2>
          <div className="space-y-4">
            {history.length > 0 ? (
              history.map((event, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <div className="flex-shrink-0 w-24 text-sm text-gray-600">
                    {event.event_time ? new Date(event.event_time).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <p className="font-medium text-gray-900">{event.event_type}</p>
                    </div>
                    <p className="text-sm text-gray-600">{event.location || 'Unknown location'}</p>
                    {event.notes && (
                      <p className="text-sm text-gray-500 mt-1">{event.notes}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No history available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}