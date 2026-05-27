import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import useCampaignStore from '../../store/campaignStore.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import CampaignForm from '../../components/campaign/CampaignForm.jsx';
import Button from '../../components/ui/Button.jsx';

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const { createCampaign, isLoading } = useCampaignStore();
  const [success, setSuccess] = useState(false);
  const [created, setCreated] = useState(null);

  const handleSubmit = async (data, status = 'active') => {
    try {
      const campaign = await createCampaign({ ...data, status });
      setCreated(campaign);
      setSuccess(true);
      toast.success(status === 'draft' ? 'Campaign saved as draft!' : 'Campaign published!');
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to create campaign');
    }
  };

  const handleDraft = (data) => handleSubmit(data, 'draft');
  const handlePublish = (data) => handleSubmit(data, 'active');

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto p-8 text-center mt-12">
          <div className="flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mx-auto mb-5">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Campaign Created! 🎉</h1>
          <p className="text-gray-500 mb-6">Your campaign is live and creators can now apply.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" onClick={() => navigate(`/campaigns/${created?._id}`)}>
              <Eye className="h-4 w-4" /> View Campaign
            </Button>
            <Button variant="outline" onClick={() => navigate('/my-campaigns')}>
              My Campaigns
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Campaign</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to connect with the right creators</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <CampaignForm
            onSubmit={handlePublish}
            isLoading={isLoading}
          />

          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              className="w-full text-gray-500"
              isLoading={isLoading}
              onClick={() => {
                // Trigger form submission with draft status via a different path
                toast('Use the main button to publish, or save as draft from the form.');
              }}
            >
              Save as Draft instead
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateCampaignPage;
