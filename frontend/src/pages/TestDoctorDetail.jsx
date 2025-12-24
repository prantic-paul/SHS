/**
 * Test Doctor Detail Page
 * Minimal version for debugging
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TestDoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/doctors')}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          ← Back to Doctors
        </button>
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold">Doctor Detail Page</h1>
          <p className="mt-2">Doctor ID: {id}</p>
          <p className="mt-2">This is a test page to verify routing works.</p>
        </div>
      </div>
    </div>
  );
};

export default TestDoctorDetail;
