import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from '../Sidebar/Sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Typography,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion, AnimatePresence } from 'framer-motion';

const LandnoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [approvedNotices, setApprovedNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchPendingNotices();
    fetchApprovedNotices();
  }, []);

  const fetchPendingNotices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://api.epublicnotices.in/api/land-notices/admin/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending notices');
      }

      const data = await response.json();
      setNotices(data.notices);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to fetch pending notices');
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedNotices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://api.epublicnotices.in/api/land-notices/admin/approved', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch approved notices');
      }

      const data = await response.json();
      setApprovedNotices(data.notices);
    } catch (error) {
      console.error('Error fetching approved notices:', error);
      toast.error('Failed to fetch approved notices');
    }
  };

  const handleApprove = async (noticeId) => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api.epublicnotices.in/api/land-notices/admin/${noticeId}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'approved' })
      });

      if (!response.ok) {
        throw new Error('Failed to approve notice');
      }

      toast.success('Notice approved successfully');
      fetchPendingNotices();
      fetchApprovedNotices();
    } catch (error) {
      console.error('Error approving notice:', error);
      toast.error('Failed to approve notice');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api.epublicnotices.in/api/land-notices/${selectedNotice.id}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: 'rejected',
          rejectionReason: rejectionReason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reject notice');
      }

      toast.success('Notice rejected successfully');
      setRejectionDialogOpen(false);
      setRejectionReason('');
      fetchPendingNotices();
    } catch (error) {
      console.error('Error rejecting notice:', error);
      toast.error('Failed to reject notice');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <CircularProgress />
        </div>
      </div>
    );
  }

  const NoticeTable = ({ notices, showActions = true }) => (
    <TableContainer component={Paper} className="shadow-lg">
      <Table>
        <TableHead className="bg-gray-100">
          <TableRow>
            <TableCell>Notice ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            {showActions && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          <AnimatePresence>
            {notices.map((notice) => (
              <motion.tr
                key={notice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TableCell>{notice.id}</TableCell>
                <TableCell>{notice.notice_title}</TableCell>
                <TableCell>
                  {notice.WebUser?.name || 'N/A'}
                  <br />
                  <span className="text-sm text-gray-500">
                    {notice.WebUser?.email || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>{formatDate(notice.createdAt)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    notice.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {notice.status}
                  </span>
                </TableCell>
                {showActions && (
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleApprove(notice.id)}
                        disabled={processing}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          setSelectedNotice(notice);
                          setRejectionDialogOpen(true);
                        }}
                        disabled={processing}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => {
                          setSelectedNotice(notice);
                          setViewDialogOpen(true);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                )}
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <Typography variant="h4" component="h1" className="text-gray-800">
            Land Notice Management
          </Typography>
          <Typography variant="subtitle1" className="text-gray-600">
            Review and manage land notices
          </Typography>
        </div>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Pending Notices" />
            <Tab label="Approved Notices" />
          </Tabs>
        </Box>

        {activeTab === 0 ? (
          <NoticeTable notices={notices} showActions={true} />
        ) : (
          <NoticeTable notices={approvedNotices} showActions={false} />
        )}

        <Dialog
          open={rejectionDialogOpen}
          onClose={() => setRejectionDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Reject Notice</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Rejection Reason"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRejectionDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleReject} 
              color="error"
              disabled={processing}
            >
              {processing ? <CircularProgress size={24} /> : 'Reject'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>View Notice</DialogTitle>
          <DialogContent>
            {selectedNotice && (
              <div className="mt-4">
                <img 
                  src={selectedNotice.notice_image} 
                  alt="Notice" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="mt-4">
                  <Typography variant="h6" gutterBottom>
                    Notice Details
                  </Typography>
                  <Typography variant="body1">
                    <strong>Title:</strong> {selectedNotice.notice_title}
                  </Typography>
                  <Typography variant="body1">
                    <strong>User:</strong> {selectedNotice.WebUser?.name || 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Date:</strong> {formatDate(selectedNotice.createdAt)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Status:</strong> {selectedNotice.status}
                  </Typography>
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default LandnoticeManagement;
