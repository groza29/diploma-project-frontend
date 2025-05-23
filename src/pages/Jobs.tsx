import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Button from '../components/Button';

interface Job {
  id: string;
  type: 'FREE' | 'PAID';
  departament: string;
  name: string;
}

const AdminJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [form, setForm] = useState<Partial<Job>>({
    type: 'PAID',
    departament: '',
    name: '',
  });

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:3000/jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleOpen = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      setForm(job);
    } else {
      setEditingJob(null);
      setForm({ type: 'PAID', departament: '', name: '' });
    }
    setOpenDialog(true);
  };

  const handleSave = async () => {
    const method = editingJob ? 'PUT' : 'POST';
    const url = editingJob
      ? `http://localhost:3000/jobs/${editingJob.id}`
      : 'http://localhost:3000/jobs';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Error saving job');

      await fetchJobs();
      setOpenDialog(false);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/jobs/${id}`, { method: 'DELETE' });
      fetchJobs();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Jobs Management</h1>
        <Button text="          Add Job" onClick={() => handleOpen()} icon={<Add />} />
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Department</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.name}</TableCell>
              <TableCell>{job.type}</TableCell>
              <TableCell>{job.departament}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpen(job)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(job.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editingJob ? 'Edit Job' : 'Create Job'}</DialogTitle>
        <DialogContent dividers>
          <div className="flex flex-col gap-4 w-full">
            <TextField
              label="Name"
              fullWidth
              className="mb-4"
              value={form.name ?? ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Department"
              fullWidth
              className="mb-4"
              value={form.departament ?? ''}
              onChange={(e) => setForm({ ...form, departament: e.target.value })}
            />
            <Select
              fullWidth
              value={form.type ?? 'Remote'}
              onChange={(e) => setForm({ ...form, type: e.target.value as Job['type'] })}
            >
              <MenuItem value="FREE">FREE</MenuItem>
              <MenuItem value="PAID">PAID</MenuItem>
            </Select>
          </div>
        </DialogContent>
        <DialogActions>
          <Button text="Cancel" className="bg-red" onClick={() => setOpenDialog(false)} />
          <Button onClick={handleSave} text={'Save'} />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminJobsPage;
