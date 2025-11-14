import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import ServiceFilter from "./ServiceFilter";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:5000/services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.log("Error loading services:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.log("Error loading categories:", err);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const filteredServices = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : services;

  return (
    <div>
      <ServiceFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onChange={setSelectedCategory}
      />

      <div>
        {filteredServices.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
