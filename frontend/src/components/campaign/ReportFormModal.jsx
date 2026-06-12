import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/axios.js';
import Modal from '../ui/Modal.jsx';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';

const ReportFormModal = ({ isOpen, onClose, campaignId, onSubmitSuccess }) => {
  const [type, setType] = useState('weekly');
  const [views, setViews] = useState('');
  const [reach, setReach] = useState('');
  const [likes, setLikes] = useState('');
  const [comments, setComments] = useState('');
  const [shares, setShares] = useState('');
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await api.post('/reports', {
        campaignId,
        type,
        metrics: {
          views: Number(views) || 0,
          reach: Number(reach) || 0,
          likes: Number(likes) || 0,
          comments: Number(comments) || 0,
          shares: Number(shares) || 0,
        },
        summary: type === 'monthly' ? summary : '',
      });

      if (data.success) {
        toast.success(`${type === 'weekly' ? 'Weekly' : 'Monthly'} report submitted! 📈`);
        onSubmitSuccess?.();
        onClose();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Collaboration Report" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Report Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Report Frequency</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="radio"
                name="reportType"
                value="weekly"
                checked={type === 'weekly'}
                onChange={() => setType('weekly')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              Weekly Performance
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="radio"
                name="reportType"
                value="monthly"
                checked={type === 'monthly'}
                onChange={() => setType('monthly')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              Monthly Summary
            </label>
          </div>
        </div>

        {/* Numeric Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Views"
            type="number"
            placeholder="e.g. 15000"
            min="0"
            required
            value={views}
            onChange={(e) => setViews(e.target.value)}
          />
          <Input
            label="Reach"
            type="number"
            placeholder="e.g. 12000"
            min="0"
            required
            value={reach}
            onChange={(e) => setReach(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Likes"
            type="number"
            placeholder="500"
            min="0"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
          />
          <Input
            label="Comments"
            type="number"
            placeholder="50"
            min="0"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
          <Input
            label="Shares"
            type="number"
            placeholder="20"
            min="0"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
          />
        </div>

        {/* Summary text area (only for monthly summary report) */}
        {type === 'monthly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Performance Summary</label>
            <textarea
              rows={3}
              placeholder="e.g. The campaign successfully generated high interest among the tech audience segment, views surpassed expectations by 20%..."
              required={type === 'monthly'}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>
            Submit Report
          </Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportFormModal;
