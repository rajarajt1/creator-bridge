import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Check, X, IndianRupee } from 'lucide-react';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { formatCurrency, formatRelativeTime, formatNumber } from '../../utils/helpers.js';

const STATUS_VARIANT = {
  pending:   'default',
  reviewing: 'info',
  accepted:  'success',
  rejected:  'error',
  withdrawn: 'warning',
};

const ApplicationCard = ({ application, onUpdateStatus }) => {
  if (!application) return null;

  const creator = application.creatorId ?? {};
  const profile = application.creatorProfile ?? {};
  const name    = creator.name ?? 'Creator';
  const avatar  = creator.avatar ?? '';

  const [expanded,    setExpanded]    = useState(false);
  const [confirming,  setConfirming]  = useState(null); // 'accepted' | 'rejected' | null
  const [isUpdating,  setIsUpdating]  = useState(false);

  const niches  = profile.niche ?? [];
  const reach   = profile.totalReach ?? 0;
  const rating  = profile.rating?.average ?? 0;

  const handleConfirm = async (status) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus?.(application._id, status);
    } finally {
      setIsUpdating(false);
      setConfirming(null);
    }
  };

  const isTerminal = ['accepted', 'rejected', 'withdrawn'].includes(application.status);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 p-4">
        <Avatar src={avatar} name={name} size="md" showBadge={creator.verificationBadge} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-gray-900 truncate">{name}</h4>
            <Badge variant={STATUS_VARIANT[application.status] ?? 'default'} size="sm" className="capitalize shrink-0">
              {application.status}
            </Badge>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-3 mt-1">
            {niches.slice(0, 2).map((n) => (
              <Badge key={n} variant="info" size="sm">{n}</Badge>
            ))}
            {reach > 0 && (
              <span className="text-xs text-gray-500">{formatNumber(reach)} reach</span>
            )}
            {rating > 0 && (
              <span className="text-xs text-gray-500">⭐ {rating.toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Cover letter ─────────────────────────────────────────────── */}
      <div className="px-4 pb-3 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex w-full items-center justify-between py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <span className="font-medium">Cover Letter</span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {expanded && (
          <p className="text-sm text-gray-700 leading-relaxed pb-2 whitespace-pre-line">
            {application.coverLetter ?? 'No cover letter provided.'}
          </p>
        )}
      </div>

      {/* ── Proposed rate ────────────────────────────────────────────── */}
      {application.proposedRate != null && (
        <div className="px-4 pb-3 flex items-center gap-1 text-sm">
          <IndianRupee className="h-4 w-4 text-indigo-500" />
          <span className="font-semibold text-gray-900">{formatCurrency(application.proposedRate)}</span>
          <span className="text-gray-500">proposed</span>
        </div>
      )}

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Link
            to={`/creators/${creator._id}`}
            className="text-xs text-indigo-600 hover:underline font-medium"
          >
            View Profile
          </Link>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-400">{formatRelativeTime(application.createdAt)}</span>
        </div>

        {/* Action buttons – only show for pending/reviewing */}
        {!isTerminal && (
          <div className="flex items-center gap-2">
            {confirming ? (
              <>
                <span className="text-xs text-gray-600">
                  {confirming === 'accepted' ? 'Accept this application?' : 'Reject this application?'}
                </span>
                <Button
                  variant={confirming === 'accepted' ? 'primary' : 'danger'}
                  size="sm"
                  isLoading={isUpdating}
                  onClick={() => handleConfirm(confirming)}
                >
                  Confirm
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirming(null)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setConfirming('accepted')}
                >
                  <Check className="h-3.5 w-3.5" /> Accept
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirming('rejected')}
                >
                  <X className="h-3.5 w-3.5" /> Reject
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
