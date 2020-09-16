import React from 'react';

const HeaderStyleDropdown = ({ headerOptions, active, onToggle }) => {
  const localOnToggle = (event) => {
    const value = event.target.value;
    onToggle(value);
  };

  return (
    <select value={active} onChange={localOnToggle}>
      <option value=''>Header Levels</option>
      {headerOptions.map((heading) => {
        return (
          <option key={heading.label} value={heading.style}>
            {heading.label}
          </option>
        );
      })}
    </select>
  );
};

export default HeaderStyleDropdown;
