"use client";
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Package, Calendar, Map, Search } from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('tanks');
  const [tanks, setTanks] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tanksRes, jobsRes, eventsRes, locationsRes] = await Promise.all([
        fetch('/api/admin/tanks').then(r => r.json()),
        fetch('/api/admin/jobs').then(r => r.json()),
        fetch('/api/admin/events').then(r => r.json()),
        fetch('/api/admin/locations').then(r => r.json())
      ]);
      setTanks(tanksRes);
      setJobs(jobsRes);
      setEvents(eventsRes);
      setLocations(locationsRes);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    const endpoint = `/api/admin/${activeTab}`;
    const method = editingItem ? 'PUT' : 'POST';
    
    // Create a copy of formData where empty strings are converted to null
    const cleanedData = Object.entries(formData).reduce((acc, [key, value]) => {
      // Convert empty strings to null for database compatibility
      acc[key] = value === '' ? null : value;
      return acc;
    }, {});

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        // Use cleanedData instead of formData
        body: JSON.stringify(editingItem ? { ...cleanedData, id: editingItem } : cleanedData)
      });
      
      if (response.ok) {
        await loadData();
        setShowForm(false);
        setEditingItem(null);
        setFormData({});
      } else {
        // Log the actual error message from the server for debugging
        const errorData = await response.json();
        console.error('Server error:', errorData);
        alert(`Error: ${errorData.error || 'Failed to save'}`);
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await fetch(`/api/admin/${activeTab}/${id}`, { method: 'DELETE' });
      await loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleEdit = (item) => {
    // Determine the correct ID based on the active tab
    let id;
    if (activeTab === 'tanks') id = item.tank_id;
    else if (activeTab === 'jobs') id = item.job_id;
    else if (activeTab === 'events') id = item.event_id;
    else if (activeTab === 'locations') id = item.location_id;

    setEditingItem(id);
    setFormData(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setShowForm(true);
  };

  const renderTankForm = () => (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Tank' : 'Add New Tank'}</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Tank Number</label>
        <input
          type="text"
          value={formData.tank_number || ''}
          onChange={e => setFormData({...formData, tank_number: e.target.value})}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="TCNU1234567"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tare Weight (kg)</label>
          <input
            type="number"
            value={formData.tare_weight_kg || ''}
            onChange={e => setFormData({...formData, tare_weight_kg: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Payload (kg)</label>
          <input
            type="number"
            value={formData.max_payload_kg || ''}
            onChange={e => setFormData({...formData, max_payload_kg: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Gross Weight (kg)</label>
          <input
            type="number"
            value={formData.max_gross_weight_kg || ''}
            onChange={e => setFormData({...formData, max_gross_weight_kg: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Next Statutory Exam Date</label>
          <input
            type="date"
            value={formData.next_statutory_exam_date || ''}
            onChange={e => setFormData({...formData, next_statutory_exam_date: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Next CSC Exam Date</label>
          <input
            type="date"
            value={formData.next_csc_exam_date || ''}
            onChange={e => setFormData({...formData, next_csc_exam_date: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          value={formData.notes || ''}
          onChange={e => setFormData({...formData, notes: e.target.value})}
          className="w-full px-3 py-2 border rounded-md"
          rows="3"
        />
      </div>

      <div className="flex gap-2">
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {editingItem ? 'Update' : 'Create'} Tank
        </button>
        <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
          Cancel
        </button>
      </div>
    </div>
  );

  const renderJobForm = () => (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Job' : 'Add New Job'}</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Tank</label>
        <select
          value={formData.tank_id || ''}
          onChange={e => setFormData({...formData, tank_id: e.target.value})}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Select Tank</option>
          {tanks.map(tank => (
            <option key={tank.tank_id} value={tank.tank_id}>{tank.tank_number}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Port of Loading (POL)</label>
          <input
            type="text"
            value={formData.pol || ''}
            onChange={e => setFormData({...formData, pol: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Port of Discharge (POD)</label>
          <input
            type="text"
            value={formData.pod || ''}
            onChange={e => setFormData({...formData, pod: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">POL Location</label>
          <select
            value={formData.pol_location_id || ''}
            onChange={e => setFormData({...formData, pol_location_id: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Location</option>
            {locations.map(loc => (
              <option key={loc.location_id} value={loc.location_id}>{loc.canonical_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">POD Location</label>
          <select
            value={formData.pod_location_id || ''}
            onChange={e => setFormData({...formData, pod_location_id: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Location</option>
            {locations.map(loc => (
              <option key={loc.location_id} value={loc.location_id}>{loc.canonical_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Loading Date</label>
          <input
            type="date"
            value={formData.loading_date || ''}
            onChange={e => setFormData({...formData, loading_date: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ETD</label>
          <input
            type="date"
            value={formData.etd || ''}
            onChange={e => setFormData({...formData, etd: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ETA</label>
          <input
            type="date"
            value={formData.eta || ''}
            onChange={e => setFormData({...formData, eta: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ATA</label>
          <input
            type="date"
            value={formData.ata || ''}
            onChange={e => setFormData({...formData, ata: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Shipping Line</label>
          <input
            type="text"
            value={formData.line || ''}
            onChange={e => setFormData({...formData, line: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vessel</label>
          <input
            type="text"
            value={formData.vessel || ''}
            onChange={e => setFormData({...formData, vessel: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Renter Company</label>
          <input
            type="text"
            value={formData.renter_company || ''}
            onChange={e => setFormData({...formData, renter_company: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Loaded Product</label>
          <input
            type="text"
            value={formData.loaded_product || ''}
            onChange={e => setFormData({...formData, loaded_product: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">BL Number</label>
          <input
            type="text"
            value={formData.bl_number || ''}
            onChange={e => setFormData({...formData, bl_number: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Free Time (Days)</label>
          <input
            type="number"
            value={formData.free_time_days || ''}
            onChange={e => setFormData({...formData, free_time_days: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {editingItem ? 'Update' : 'Create'} Job
        </button>
        <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
          Cancel
        </button>
      </div>
    </div>
  );

  // In app/admin/tanks/page.tsx

  const renderEventForm = () => (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Event' : 'Add New Event'}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tank</label>
          <select
            value={formData.tank_id || ''}
            onChange={e => setFormData({...formData, tank_id: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Tank</option>
            {tanks.map(tank => (
              <option key={tank.tank_id} value={tank.tank_id}>{tank.tank_number}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job</label>
          <select
            value={formData.job_id || ''}
            onChange={e => setFormData({...formData, job_id: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Job (Optional)</option>
            {jobs.map(job => (
              <option key={job.job_id} value={job.job_id}>
                {job.pol} → {job.pod} ({job.vessel})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Event Type</label>
          <select
            value={formData.event_type || ''}
            onChange={e => setFormData({...formData, event_type: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Type</option>
            {/* Updated options to match your database ENUM values */}
            <option value="LOADING_DATE">Loading Date</option>
            <option value="ETD">ETD (Est. Departure)</option>
            <option value="ETA">ETA (Est. Arrival)</option>
            <option value="ATA">ATA (Actual Arrival)</option>
            <option value="GATE_OUT">Gate Out</option>
            <option value="EMPTY_DATE">Empty Date</option>
            <option value="STORAGE_DATE">Storage Date</option>
            <option value="STATUS_UPDATE">Status Update</option>
            <option value="NOTE">Note</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Event Time</label>
          <input
            type="datetime-local"
            value={formData.event_time || ''}
            onChange={e => setFormData({...formData, event_time: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location Name</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={e => setFormData({...formData, location: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location (from database)</label>
          <select
            value={formData.location_id || ''}
            onChange={e => setFormData({...formData, location_id: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Location (Optional)</option>
            {locations.map(loc => (
              <option key={loc.location_id} value={loc.location_id}>{loc.canonical_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status Text</label>
        <input
          type="text"
          value={formData.status_text || ''}
          onChange={e => setFormData({...formData, status_text: e.target.value})}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Note</label>
        <textarea
          value={formData.note || ''}
          onChange={e => setFormData({...formData, note: e.target.value})}
          className="w-full px-3 py-2 border rounded-md"
          rows="2"
        />
      </div>

      <div className="flex gap-2">
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {editingItem ? 'Update' : 'Create'} Event
        </button>
        <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
          Cancel
        </button>
      </div>
    </div>
  );

  // ... inside AdminPanel function

  const fetchCoordinates = async () => {
    const queryName = formData.canonical_name;
    const queryCountry = formData.country_code;

    if (!queryName) {
      alert("Please enter a Canonical Name first (e.g., 'Rotterdam Port').");
      return;
    }

    // specific query prioritizes the name + country for better accuracy
    const query = `${queryName}${queryCountry ? ',' + queryCountry : ''}`;
    
    try {
      // Use OpenStreetMap's free Nominatim API
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        }));
      } else {
        alert("Location not found. Try checking the spelling or adding a Country Code.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Failed to fetch coordinates. Please enter them manually.");
    }
  };

  const renderLocationForm = () => {
    // Helper to generate a small map preview URL
    const getMapPreviewUrl = (lat, lon) => {
      const delta = 0.5; // Zoom level (smaller = zoomed in)
      return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - delta},${lat - delta},${lon + delta},${lat + delta}&layer=mapnik&marker=${lat},${lon}`;
    };

    return (
      <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Location' : 'Add New Location'}</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1"> Name</label>
          <input
            type="text"
            value={formData.canonical_name || ''}
            onChange={e => setFormData({...formData, canonical_name: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Rotterdam Port"
          />
        </div>
  
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kind</label>
            <select
              value={formData.kind || ''}
              onChange={e => setFormData({...formData, kind: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select Kind</option>
              <option value="port">Port</option>
              <option value="depot">Depot</option>
              <option value="warehouse">Warehouse</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Country Code</label>
            <input
              type="text"
              maxLength="2"
              value={formData.country_code || ''}
              onChange={e => setFormData({...formData, country_code: e.target.value.toUpperCase()})}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="NL"
            />
          </div>
        </div>
  
        <div className="flex justify-end">
          <button
            type="button"
            onClick={fetchCoordinates}
            className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
          >
            <Search className="w-3 h-3" />
            Auto-fill Coordinates from Name
          </button>
        </div>
  
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input
              type="number"
              step="0.000001"
              value={formData.lat || ''}
              onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="51.9225"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input
              type="number"
              step="0.000001"
              value={formData.lon || ''}
              onChange={e => setFormData({...formData, lon: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="4.4792"
            />
          </div>
        </div>

        {/* Map Preview Snippet */}
        {formData.lat && formData.lon && (
          <div className="mt-4 border rounded-md overflow-hidden shadow-sm">
            <div className="bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-500 border-b">
              Location Preview
            </div>
            <iframe
              width="100%"
              height="200"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={getMapPreviewUrl(formData.lat, formData.lon)}
              className="block"
            ></iframe>
            <div className="bg-gray-50 px-3 py-1 text-xs text-gray-500 text-right">
              <a 
                href={`https://www.openstreetmap.org/?mlat=${formData.lat}&mlon=${formData.lon}#map=15/${formData.lat}/${formData.lon}`} 
                target="_blank" 
                className="hover:underline text-blue-600"
              >
                View Larger Map
              </a>
            </div>
          </div>
        )}
  
        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {editingItem ? 'Update' : 'Create'} Location
          </button>
          <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderList = () => {
    let data, columns;
    
    switch(activeTab) {
      case 'tanks':
        data = tanks;
        columns = ['tank_number', 'tare_weight_kg', 'max_payload_kg', 'next_statutory_exam_date'];
        break;
      case 'jobs':
        data = jobs;
        columns = ['pol', 'pod', 'vessel', 'loaded_product', 'eta'];
        break;
      case 'events':
        data = events;
        columns = ['event_type', 'event_time', 'location', 'status_text'];
        break;
      case 'locations':
        data = locations;
        columns = ['canonical_name', 'kind', 'country_code', 'lat', 'lon'];
        break;
      default:
        return null;
    }

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              {columns.map(col => (
                <th key={col} className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  {col.replace(/_/g, ' ').toUpperCase()}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col} className="px-4 py-3 text-sm">
                    {item[col] || '-'}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <Edit2 className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.tank_id || item.job_id || item.event_id || item.location_id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No {activeTab} found. Add one to get started.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tank Logistics Admin</h1>
          <a href="/" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            <Map className="w-4 h-4" />
            View Map
          </a>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setActiveTab('tanks'); setShowForm(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${activeTab === 'tanks' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            <Package className="w-4 h-4" />
            Tanks
          </button>
          <button
            onClick={() => { setActiveTab('jobs'); setShowForm(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${activeTab === 'jobs' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            <Calendar className="w-4 h-4" />
            Jobs
          </button>
          <button
            onClick={() => { setActiveTab('events'); setShowForm(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${activeTab === 'events' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            <MapPin className="w-4 h-4" />
            Events
          </button>
          <button
            onClick={() => { setActiveTab('locations'); setShowForm(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${activeTab === 'locations' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            <Map className="w-4 h-4" />
            Locations
          </button>
        </div>

        {!showForm && (
          <div className="mb-4">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add New {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
            </button>
          </div>
        )}

        {showForm && (
          <div className="mb-6">
            {activeTab === 'tanks' && renderTankForm()}
            {activeTab === 'jobs' && renderJobForm()}
            {activeTab === 'events' && renderEventForm()}
            {activeTab === 'locations' && renderLocationForm()}
          </div>
        )}

        {!showForm && renderList()}
      </div>
    </div>
  );
}