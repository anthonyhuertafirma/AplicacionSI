import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkCard.css';

const WorkCard = ({ icon, name, description, tag, path }) => {
  const navigate = useNavigate();

  return (
    <div className="project-card">
      <div className="card-header">
        <div className="card-icon">{icon}</div>
        <span className="card-tag">{tag}</span>
      </div>
      <div className="card-body">
        <h3 className="card-title">{name}</h3>
        <p className="card-description">{description}</p>
      </div>
      <div className="card-footer">
        <button className="card-button" onClick={() => navigate(path)}>
          Ver Proyecto
        </button>
      </div>
    </div>
  );
};

export default WorkCard;