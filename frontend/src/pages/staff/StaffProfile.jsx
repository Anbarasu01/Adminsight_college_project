import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './StaffProfile.css';

const StaffProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    position: user?.position || ''
  });

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="staff-profile">
      <div className="profile-header">
        <h2>My Profile</h2>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-info">
          <div className="info-group">
            <label>Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            ) : (
              <p>{user?.name}</p>
            )}
          </div>

          <div className="info-group">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            ) : (
              <p>{user?.email}</p>
            )}
          </div>

          <div className="info-group">
            <label>Position</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
              />
            ) : (
              <p>{user?.position || 'Staff Member'}</p>
            )}
          </div>

          <div className="info-group">
            <label>Role</label>
            <p>Staff</p>
          </div>
        </div>

        {isEditing && (
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default StaffProfile;