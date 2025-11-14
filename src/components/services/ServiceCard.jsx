import React from "react";

const ServiceCard = ({ service }) => {
  return (
    <div>
      {service.images && service.images.length > 0 ? (
        <img
          src={service.images[0].url}
          alt={service.images[0].alt || service.title}
        />
      ) : (
        <div>No Image</div>
      )}

      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <p>{service.price}</p>
      <p>Provider: {service.provider?.name || "Unknown"}</p>
    </div>
  );
};

export default ServiceCard;
