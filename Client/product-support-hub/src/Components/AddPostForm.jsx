import React, { useState, useEffect } from 'react';
import { usePost } from '../Hook/usePost';
import { useNavigate } from 'react-router-dom';
import { useImageProcessing } from '../Hook/useImageProcessing.js';

const AddPostForm = () => {
  const { createPostMutation, isError, isLoading } = usePost();
  const [image, setImage] = useState(null);
  const { processOCRImage } = useImageProcessing();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    installation: '',
    product: '',
    type: '',
    severity: '',
    status: '',
    resolution: '',
  });

  const products = [
    'Account Production Advance',
    'Cosec',
    'Practice Management ',
    'Onvio',
    'Personal tax',
    'Corporation tax',
    'Virtual office',
  ];
  const severities = ['Low', 'Medium', 'High', 'Critical'];
  const types = ['Bug', 'Integration', 'Template', 'Data Base Issue', 'DVO'];
  const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
  const installation = ['Stand alone', 'Network', 'DVO', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      createPostMutation(formData);
      alert('Bug Post created successfully go to post to check you post ');
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  //handle copy paste

  // Listen for paste events globally
  useEffect(() => {
    const handlePaste = (e) => {
      // Check if clipboard contains image data
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          // Get the image as a file
          const file = items[i].getAsFile();
          if (!file) continue;

          // Set the image file
          setImage(file);

          processOCRImage(file)
            .then((data) => {
              // Populate form fields with OCR data
              console.log('OCR Data:', data.text);
              setFormData((prevData) => ({
                title: data.text || '',
                description: data.description || '',
              }));
            })
            .catch((error) => {
              console.error('Error processing image:', error);
              alert('Failed to process image. Please try again.');
            });

          const notification = document.createElement('div');
          notification.className =
            'fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50';
          notification.innerHTML =
            '<p>Image pasted! Click "Process Image" to analyze it.</p>';
          document.body.appendChild(notification);

          setTimeout(() => {
            notification.remove();
          }, 3000);

          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className="p-6">
      {' '}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-6 space-y-6 max-w-2xl mx-auto border"
      >
        <h2 className="text-2xl font-bold text-gray-800">Post New Bug</h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        {/* installation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Installation
          </label>
          <select
            name="installation"
            value={formData.installation}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select installation</option>
            {installation.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Product */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product
          </label>
          <select
            name="product"
            value={formData.product}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select type</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severity
          </label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select severity</option>
            {severities.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Resolution */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Suggested Resolution
          </label>
          <textarea
            name="resolution"
            value={formData.resolution}
            onChange={handleChange}
            required
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPostForm;
