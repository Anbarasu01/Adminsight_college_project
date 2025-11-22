import React from 'react';
import '../../css/common/Card.css';

const Card = ({ 
  children, 
  title, 
  actions,
  className = '',
  padding = 'medium'
}) => {
  return (
    <div className={`card card-padding-${padding} ${className}`}>
      {(title || actions) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;