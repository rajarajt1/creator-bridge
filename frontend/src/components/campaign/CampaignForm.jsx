import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import { NICHE_OPTIONS, PLATFORM_OPTIONS, BUDGET_TYPES } from '../../utils/constants.js';

// ─── Validation schema ────────────────────────────────────────────────────────

const CONTENT_TYPES = ['post', 'story', 'reel', 'video', 'review', 'unboxing', 'livestream'];

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  category: z.string().min(1, 'Category is required'),
  requirements: z.object({
    platforms:    z.array(z.string()).optional(),
    contentType:  z.array(z.string()).optional(),
    minFollowers: z.coerce.number().int().min(0).optional().or(z.literal('')),
    location:     z.string().optional(),
  }).optional(),
  budget: z.object({
    type:     z.string().min(1, 'Budget type is required'),
    amount:   z.coerce.number().positive('Amount must be positive').optional().or(z.literal('')),
    currency: z.string().default('INR'),
  }),
  deadline: z.string().min(1, 'Deadline is required').refine(
    (v) => new Date(v) > new Date(),
    'Deadline must be in the future'
  ),
  tags: z.array(z.string()).max(10).optional(),
});

// ─── Component ────────────────────────────────────────────────────────────────

const CampaignForm = ({ defaultValues, onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      requirements: { platforms: [], contentType: [], minFollowers: '', location: '' },
      budget: { type: '', amount: '', currency: 'INR' },
      deadline: '',
      tags: [],
      ...defaultValues,
    },
  });

  const [tagInput, setTagInput] = useState('');
  const tags      = watch('tags') ?? [];
  const budgetType = watch('budget.type');
  const platforms  = watch('requirements.platforms') ?? [];
  const ctypes     = watch('requirements.contentType') ?? [];

  // ── Helpers ────────────────────────────────────────────────────────────────

  const toggleArr = (field, value, current) => {
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, updated, { shouldValidate: true });
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 10) {
      setValue('tags', [...tags, t]);
      setTagInput('');
    }
  };

  const removeTag = (tag) => setValue('tags', tags.filter((t) => t !== tag));

  // Minimum date for deadline picker
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Title ─────────────────────────────────────────────────────── */}
      <Input
        label="Campaign Title"
        placeholder="e.g. Summer Fashion Collection Promotion"
        error={errors.title?.message}
        {...register('title')}
      />

      {/* ── Description ───────────────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          rows={4}
          placeholder="Describe the campaign goals, deliverables, and brand guidelines…"
          className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:border-transparent ${
            errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
          }`}
          {...register('description')}
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
      </div>

      {/* ── Category ──────────────────────────────────────────────────── */}
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <Select
            label="Category"
            options={NICHE_OPTIONS}
            placeholder="Select a category"
            error={errors.category?.message}
            {...field}
          />
        )}
      />

      {/* ── Requirements ──────────────────────────────────────────────── */}
      <fieldset className="border border-gray-200 rounded-xl p-4 space-y-4">
        <legend className="text-sm font-semibold text-gray-700 px-1">Requirements</legend>

        {/* Platforms */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Platforms</p>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_OPTIONS.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={platforms.includes(value)}
                  onChange={() => toggleArr('requirements.platforms', value, platforms)}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Content types */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content Type</p>
          <div className="flex flex-wrap gap-2">
            {CONTENT_TYPES.map((ct) => (
              <label key={ct} className="flex items-center gap-1.5 text-sm cursor-pointer select-none capitalize">
                <input
                  type="checkbox"
                  checked={ctypes.includes(ct)}
                  onChange={() => toggleArr('requirements.contentType', ct, ctypes)}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                {ct}
              </label>
            ))}
          </div>
        </div>

        {/* Min followers + location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Min. Followers"
            type="number"
            placeholder="e.g. 10000"
            min="0"
            error={errors.requirements?.minFollowers?.message}
            {...register('requirements.minFollowers')}
          />
          <Input
            label="Location (optional)"
            placeholder="City, State or Country"
            {...register('requirements.location')}
          />
        </div>
      </fieldset>

      {/* ── Budget ────────────────────────────────────────────────────── */}
      <fieldset className="border border-gray-200 rounded-xl p-4 space-y-4">
        <legend className="text-sm font-semibold text-gray-700 px-1">Budget</legend>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Type</p>
          <div className="flex flex-wrap gap-3">
            {BUDGET_TYPES.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="radio"
                  value={value}
                  {...register('budget.type')}
                  className="h-3.5 w-3.5 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                {label}
              </label>
            ))}
          </div>
          {errors.budget?.type && <p className="mt-1 text-xs text-red-600">{errors.budget.type.message}</p>}
        </div>

        {budgetType === 'fixed' && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount (₹)"
              type="number"
              placeholder="e.g. 25000"
              min="0"
              error={errors.budget?.amount?.message}
              {...register('budget.amount')}
            />
          </div>
        )}
      </fieldset>

      {/* ── Deadline ──────────────────────────────────────────────────── */}
      <Input
        label="Application Deadline"
        type="date"
        min={minDate}
        error={errors.deadline?.message}
        {...register('deadline')}
      />

      {/* ── Tags ──────────────────────────────────────────────────────── */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Tags <span className="text-gray-400 font-normal">(max 10)</span></p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-indigo-900"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {tags.length < 10 && (
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder="Add a tag and press Enter"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Button type="button" variant="outline" size="sm" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* ── Submit ────────────────────────────────────────────────────── */}
      <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
        {defaultValues?._id ? 'Update Campaign' : 'Create Campaign'}
      </Button>
    </form>
  );
};

export default CampaignForm;
