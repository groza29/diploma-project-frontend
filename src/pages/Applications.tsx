import React, { useEffect, useState } from 'react';
import Button from '../components/Button';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

interface Application {
  id: string;
  user_id: string;
  post_id: string;
  feedback?: string;
  rating?: number;
  status: boolean;
  accepted: string;
}

const AdminApplications: React.FC = () => {
  const token = localStorage.getItem('token');

  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const fetchApplications = async () => {
    const res = await fetch('http://localhost:3000/applications', {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    const data = await res.json();
    setApplications(data);
  };

  const handleEdit = (app: Application) => {
    setSelectedApp(app);
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedApp) return;
    await fetch(`http://localhost:3000/applications/${selectedApp.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(selectedApp),
    });
    setEditDialogOpen(false);
    fetchApplications();
  };

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:3000/applications/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    fetchApplications();
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="p-6 bg-background h-screen w-full">
      <h2 className="text-2xl text-selected font-bold mb-4 flex items-center justify-center">
        All Applications
      </h2>
      <table className="min-w-full table-auto border-collapse border border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Accepted</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Feedback</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td className="border p-2">{app.id}</td>
              <td className="border p-2">{app.status ? 'Open' : 'Closed'}</td>
              <td className="border p-2">{app.accepted}</td>
              <td className="border p-2">{app.rating ?? '-'}</td>
              <td className="border p-2">{app.feedback ?? '-'}</td>
              <td className="border p-2 flex gap-2 flex items-center justify-center">
                <Button onClick={() => handleEdit(app)} text="Edit" />
                <Button className="bg-red" onClick={() => handleDelete(app.id)} text="Delete" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth>
        <DialogTitle>Edit Application</DialogTitle>
        <DialogContent className="flex flex-col gap-3">
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedApp?.status ?? false}
              onChange={(e) =>
                setSelectedApp({ ...selectedApp!, status: e.target.value === 'true' })
              }
              label="Status"
            >
              <MenuItem value={'true'}>Open</MenuItem>
              <MenuItem value={'false'}>Closed</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Accepted</InputLabel>
            <Select
              value={selectedApp?.accepted ?? ''}
              onChange={(e) => setSelectedApp({ ...selectedApp!, accepted: e.target.value })}
              label="Accepted"
            >
              <MenuItem value="Accepted">Accepted</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="In progress">In progress</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Feedback"
            value={selectedApp?.feedback ?? ''}
            onChange={(e) => setSelectedApp({ ...selectedApp!, feedback: e.target.value })}
            fullWidth
          />

          <TextField
            label="Rating"
            type="number"
            value={selectedApp?.rating ?? ''}
            onChange={(e) => setSelectedApp({ ...selectedApp!, rating: Number(e.target.value) })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button text="Close" onClick={() => setEditDialogOpen(false)} className="bg-red" />
          <Button text="Save" onClick={handleSave} />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminApplications;
