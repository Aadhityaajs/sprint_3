// src/complaints/ComplaintsDashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import SummaryCards from './components/SummaryCards';
import SearchFilters from './components/SearchFilters';
import ComplaintsTable from './components/ComplaintsTable';
import RaiseComplaintModal from './components/RaiseComplaintModal';
import { getAllComplaints, createComplaint, resolveComplaint, deleteComplaint } from '../Apis/complaintsApi.jsx';

import AdminHeader from './components/AdminHeader.jsx';
import { useNavigate } from 'react-router-dom';

export default function ComplaintsDashboard() {
  const navigate = useNavigate();

  const [role, setRole] = useState('');
  const [loggedUserId, setLoggedUserId] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("currentUser");
    if (sessionData) {
      const currentUser = JSON.parse(sessionData);
      setRole(currentUser.role);
      setIsAdmin(currentUser.role === 'admin');
      setLoggedUserId(Number(currentUser.userId));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchId, setSearchId] = useState('');
  const [statusFilters, setStatusFilters] = useState({
    Active: true,
    Closed: true,
    Deleted: true
  });
  const [userType, setUserType] = useState('ALL'); // admin only
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    bookingId: '',
    userId: loggedUserId,
    clientOrHost: role === 'client' ? 'client' : 'host',
    description: ''
  });
  const [errors, setErrors] = useState({});

  // LOAD complaints from backend
  useEffect(() => {
    let mounted = true;

    getAllComplaints(role, loggedUserId).then((res) => {
      console.log("Fetched complaints in main page: ", res.complaints);
      if (!mounted) return;
      setComplaints(res.complaints);
      setLoading(false);
    });
    

    return () => (mounted = false);
  }, [role, loggedUserId]);

  // SUMMARY cards
  const summary = useMemo(() => {
    if (isAdmin) {
      return {
        total: complaints.length,
        active: complaints.filter((c) => c.status === 'active').length,
        resolved: complaints.filter((c) => c.status === 'closed').length
      };
    }

    const userRows = complaints.filter(
      (c) => Number(c.userId) === Number(loggedUserId)
    );

    return {
      total: userRows.length,
      active: userRows.filter((c) => c.status === 'active').length,
      resolved: userRows.filter((c) => c.status === 'closed').length
    };
  }, [complaints, isAdmin, loggedUserId]);

  // Toggle statuses
  const toggleStatus = (key) =>
    setStatusFilters((s) => ({ ...s, [key]: !s[key] }));

  // FILTER rows
  const filteredRows = useMemo(() => {
    let rows = [...complaints];

    // user-specific filtering
    if (!isAdmin) {
      rows = rows.filter(
        (r) => Number(r.userId) === Number(loggedUserId)
      );
    }

    // search by complaint id
    if (searchId.trim()) {
      const num = Number(searchId);
      if (!isNaN(num)) {
        rows = rows.filter((r) => r.id === num);
      } else {
        return [];
      }
    }

    // Admin filters
    if (isAdmin) {
      if (userType === 'client')
        rows = rows.filter(
          (r) => (r.clientOrHost || '').toUpperCase() === 'client'
        );
      if (userType === 'host')
        rows = rows.filter(
          (r) => (r.clientOrHost || '').toUpperCase() === 'host'
        );
    }

    // Date filtering
    if (isAdmin && (dateRange.from || dateRange.to)) {
      const from = dateRange.from ? new Date(dateRange.from) : null;
      const to = dateRange.to ? new Date(dateRange.to) : null;

      rows = rows.filter((r) => {
        const d = new Date(r.createdOn);
        if (from && d < from) return false;

        if (to) {
          const end = new Date(dateRange.to);
          end.setHours(23, 59, 59, 999);
          if (d > end) return false;
        }

        return true;
      });
    }

    // Status filtering
    const allowed = Object.entries(statusFilters)
      .filter(([_, v]) => v)
      .map(([k]) => k);

    return rows.filter((r) => allowed.includes(r.status));
  }, [complaints, isAdmin, loggedUserId, searchId, userType, dateRange, statusFilters]);

  // ADMIN: resolve complaint
  const handleResolve = async (id) => {
    try {
      const res = await resolveComplaint(role, loggedUserId, id);

      if (!res.error) {
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? res.complaint : c))
        );
      }
    } catch (err) {
      console.error('Resolve failed', err);
    }
  };

  // USER: delete complaint
  const handleDelete = async (id) => {
    try {
      const res = await deleteComplaint(role, loggedUserId, id);

      if (!res.error) {
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? res.complaint : c))
        );
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  // Modal handling
  const openModal = () => {
    setForm({
      bookingId: '',
      userId: loggedUserId,
      clientOrHost: role === 'client' ? 'client' : 'host',
      description: ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const validateForm = () => {
    const err = {};
    if (!form.bookingId) err.bookingId = 'Booking required';
    if (!form.description) err.description = 'Description required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // CREATE complaint
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await createComplaint(role, loggedUserId, {
        bookingId: form.bookingId,
        complaintDescription: form.description
      });

      if (!res.error) {
        setComplaints((prev) => [res.complaint, ...prev]);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Add failed', err);
    }
  };


  return (
    <div className="p-5 max-w-full mx-auto">
      <Header />

      <main className="bg-transparent">
        <div className="flex gap-4 mb-4 items-start">
          {isAdmin ? (
            <AdminHeader
              summary={summary}
              searchId={searchId}
              setSearchId={setSearchId}
              statusFilters={statusFilters}
              toggleStatus={toggleStatus}
              userType={userType}
              setUserType={setUserType}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          ) : (
            <>
              <SummaryCards summary={summary} />
              <SearchFilters
                searchId={searchId}
                setSearchId={setSearchId}
                statusFilters={statusFilters}
                toggleStatus={toggleStatus}
                userType={userType}
                setUserType={setUserType}
                dateRange={dateRange}
                setDateRange={setDateRange}
                isAdmin={false}
                onOpenModal={openModal}
              />
            </>
          )}
        </div>

        {loading ? (
          <div className="p-6">Loading complaints…</div>
        ) : (
          <ComplaintsTable
            rows={filteredRows}
            onResolve={handleResolve}
            onDelete={handleDelete}
            isAdmin={isAdmin}
          />
        )}
      </main>

      {isModalOpen && (
        <RaiseComplaintModal
          form={form}
          setForm={setForm}
          errors={errors}
          onSubmit={handleSubmit}
          onClose={closeModal}
          userRole={role === 'admin' ? 'client' : role}
        />
      )}
    </div>
  );
}
