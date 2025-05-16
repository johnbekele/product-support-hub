import React, { useState } from 'react';

function OptionButton({ options, opt, handlSelectedOption }) {
  const [selectedOption, setSelectedOption] = useState(options[0].value);

  const handleChange = (event) => {
    const newValue = event.target.value;

    handlSelectedOption(newValue);
  };

  return (
    <div className="flex flex-col w-full max-w-xs mx-auto my-4 p-4">
      <label htmlFor={opt} className="mb-2 text-sm font-medium text-gray-700">
        {opt}
      </label>
      <select
        name={opt}
        id={opt}
        value={selectedOption} // Control the component with state
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default OptionButton;
