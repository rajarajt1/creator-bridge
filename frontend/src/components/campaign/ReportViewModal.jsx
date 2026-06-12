import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/axios.js';
import Modal from '../ui/Modal.jsx';
import { Skeleton } from '../ui/Loader.jsx';
import { formatNumber, formatDate } from '../../utils/helpers.js';

const ReportViewModal = ({ isOpen, onClose, campaignId }) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/reports/campaign/${campaignId}`);
        if (data.success) {
          setReports(data.reports ?? []);
        }
      } catch (err) {
        toast.error(err?.response?.data?.message ?? 'Failed to load reports');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && campaignId) {
      fetchReports();
    }
  }, [isOpen, campaignId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Campaign Performance Reports" size="lg">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton count={4} />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">No performance reports submitted for this campaign yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Aggregated Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5 text-center">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Views</p>
                <p className="text-lg font-bold text-indigo-700 mt-0.5">
                  {formatNumber(reports.reduce((sum, r) => sum + (r.metrics?.views ?? 0), 0))}
                </p>
              </div>
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5 text-center">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Reach</p>
                <p className="text-lg font-bold text-indigo-700 mt-0.5">
                  {formatNumber(reports.reduce((sum, r) => sum + (r.metrics?.reach ?? 0), 0))}
                </p>
              </div>
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5 text-center">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Reports Filed</p>
                <p className="text-lg font-bold text-indigo-700 mt-0.5">{reports.length}</p>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-1.5">Submitted Reports</h3>
              
              {reports.map((report) => (
                <div key={report._id} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white hover:border-indigo-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        report.type === 'weekly' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      } uppercase tracking-wider`}>
                        {report.type}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">Submitted on {formatDate(report.createdAt)} by {report.creatorId?.name ?? 'Creator'}</p>
                    </div>
                  </div>

                  {/* Metrics details */}
                  <div className="grid grid-cols-5 gap-2 text-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase">Views</p>
                      <p className="text-xs font-bold text-gray-700 mt-0.5">{formatNumber(report.metrics?.views)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase">Reach</p>
                      <p className="text-xs font-bold text-gray-700 mt-0.5">{formatNumber(report.metrics?.reach)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase">Likes</p>
                      <p className="text-xs font-bold text-gray-700 mt-0.5">{formatNumber(report.metrics?.likes)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase">Comments</p>
                      <p className="text-xs font-bold text-gray-700 mt-0.5">{formatNumber(report.metrics?.comments)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase">Shares</p>
                      <p className="text-xs font-bold text-gray-700 mt-0.5">{formatNumber(report.metrics?.shares)}</p>
                    </div>
                  </div>

                  {/* Summary (Monthly summary) */}
                  {report.summary && (
                    <div className="text-xs text-gray-600 bg-indigo-50/20 border border-indigo-100/50 p-3 rounded-lg leading-relaxed">
                      <p className="font-semibold text-gray-800 mb-1">Performance Summary:</p>
                      {report.summary}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReportViewModal;
