import React from "react";

const ServiceFilter = ({ categories, selectedCategory, onChange }) => {
  return (
    <div>
      <h4>Filter</h4>

      <label>Category:</label>
      <select
        value={selectedCategory}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All</option>

        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ServiceFilter;
