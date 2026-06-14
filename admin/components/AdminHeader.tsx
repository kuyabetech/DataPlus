import React from 'react';

interface AdminHeaderProps {
  title: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title }) => (
  <header style={styles.header}>
    <h1 style={styles.title}>{title}</h1>
    <div style={styles.meta}>
      <span style={styles.metaLabel}>Admin Panel</span>
      <span style={styles.metaUser}>Logged in as Admin</span>
    </div>
  </header>
);

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 32px',
    borderBottom: '1px solid #E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    margin: 0,
  },
  meta: {
    textAlign: 'right' as const,
  },
  metaLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#6B7280',
  },
  metaUser: {
    display: 'block',
    fontSize: '16px',
    fontWeight: 600,
    color: '#111827',
  },
};

export default AdminHeader;
