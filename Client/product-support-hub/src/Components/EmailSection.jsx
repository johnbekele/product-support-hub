// components/EmailSection.js
import React, { useEffect } from 'react';
import { FaSpinner, FaCopy } from 'react-icons/fa';
import { useEmail } from '../Hook/useEmailData.js';
import parse from 'html-react-parser';

function EmailSection({ bug }) {
  const {
    emailData,
    generateEmail,
    isGenerating,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useEmail(bug?.id);

  // Generate email automatically when component mounts if bug is resolved
  useEffect(() => {
    if (
      bug?.status?.toLowerCase() === 'resolved' &&
      !emailData &&
      !isGenerating
    ) {
      generateEmail();
    }
  }, [bug?.status, emailData, isGenerating]);

  const copyToClipboard = () => {
    if (!emailData?.bodyHtml) return;

    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = emailData.bodyHtml;

    // Get the text content
    const textContent = tempDiv.textContent || tempDiv.innerText;

    // Copy to clipboard
    navigator.clipboard
      .writeText(textContent)
      .then(() => alert('Email content copied to clipboard!'))
      .catch((err) => console.error('Failed to copy text: ', err));
  };

  // Display loading state
  if (isLoading && bug?.status?.toLowerCase() === 'resolved') {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Email Template
        </h3>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-center">
            <FaSpinner className="animate-spin text-blue-500 mr-2" />
            <p className="text-blue-700">Generating email template...</p>
          </div>
        </div>
      </div>
    );
  }

  // Display error state
  if (isError && bug?.status?.toLowerCase() === 'resolved') {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Email Template
        </h3>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">
            Error generating email: {error.message}
          </p>
          <button
            onClick={generateEmail}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 py-1 px-3 rounded text-sm"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <FaSpinner className="inline animate-spin mr-1" /> Generating...
              </>
            ) : (
              'Try Again'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Display appropriate content based on bug status
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Email Template
      </h3>

      {bug?.status?.toLowerCase() === 'resolved' && isSuccess && emailData ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">{emailData.subject}</h4>
            <button
              onClick={copyToClipboard}
              className="flex items-center text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 py-1 px-3 rounded transition-colors"
            >
              <FaCopy className="mr-2" /> Copy
            </button>
          </div>

          <div className="email-content prose prose-sm max-w-none">
            {parse(emailData.bodyHtml)}
          </div>
        </div>
      ) : bug?.status?.toLowerCase() === 'resolved' ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-700 mb-2">
            Bug is resolved but no email template has been generated yet.
          </p>
          <button
            onClick={generateEmail}
            className="bg-green-100 hover:bg-green-200 text-green-800 py-1 px-3 rounded text-sm"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <FaSpinner className="inline animate-spin mr-1" /> Generating...
              </>
            ) : (
              'Generate Email'
            )}
          </button>
        </div>
      ) : bug?.status?.toLowerCase() === 'in progress' ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-center">
            <FaSpinner className="animate-spin text-blue-500 mr-2" />
            <p className="text-blue-700">
              Status - In Progress. AI will create the email once the bug is
              resolved.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-700">
            This bug is open and awaiting resolution. AI will create the email
            once the bug is resolved.
          </p>
        </div>
      )}
    </div>
  );
}

export default EmailSection;
