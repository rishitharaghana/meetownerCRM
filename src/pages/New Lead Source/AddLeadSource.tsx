import React, { useState, useEffect } from 'react';
import { Plus, Database, Edit2, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addLeadSource, getLeadSources } from '../../store/slices/leadslice'; 
import { RootState } from '../../store/store';

interface LeadSource {
  lead_source_id: number;
  name: string;
  date_added: string;
}

interface AddLeadSourceFormProps {
  onSubmit: (source: Omit<LeadSource, 'lead_source_id' | 'date_added'> | LeadSource) => void;
  onCancel: () => void;
  editingSource?: LeadSource | null;
}

function AddLeadSourceForm({ onSubmit, onCancel, editingSource }: AddLeadSourceFormProps) {
  const dispatch = useDispatch();
  const { leadSources, loading, error } = useSelector((state: RootState) => state.lead);
  const [formData, setFormData] = useState({
    name: editingSource?.name || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!leadSources) {
      dispatch(getLeadSources());
    }
  }, [dispatch, leadSources]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Source name is required';
    } else if (!editingSource && leadSources) {
      const isDuplicate = leadSources.some(
        source => source.name.toLowerCase() === formData.name.trim().toLowerCase()
      );
      if (isDuplicate) {
        newErrors.name = 'A lead source with this name already exists';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (editingSource) {
        onSubmit({
          ...editingSource,
          ...formData,
        });
      } else {
        const result = await dispatch(addLeadSource({ name: formData.name.trim() }));
        if (addLeadSource.fulfilled.match(result)) {
          onSubmit(result.payload);
          setFormData({ name: '' });
          onCancel();
        } else {
          setErrors({ name: result.payload || 'Failed to add lead source' });
        }
      }
    } catch (error) {
      setErrors({ name: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="px-8 py-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900">
          {editingSource ? 'Edit Lead Source' : 'Add New Lead Source'}
        </h2>
        <p className="text-gray-600 mt-1">
          {editingSource ? 'Update the lead source information' : 'Create a new lead source to track your leads effectively'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="px-8 py-6">
        {!editingSource && leadSources && leadSources.length > 0 && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">Existing Lead Sources ({leadSources.length})</h3>
            <div className="flex flex-wrap gap-2">
              {leadSources.map((source) => (
                <span
                  key={source.lead_source_id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white border border-blue-200 text-blue-800"
                >
                  {source.name}
                </span>
              ))}
            </div>
            <p className="text-xs text-blue-700 mt-2">
              Make sure your new source name is unique and doesn't duplicate any existing sources.
            </p>
          </div>
        )}

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Source Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              placeholder="e.g., LinkedIn Ads, Google Organic, Facebook Campaign"
              disabled={isSubmitting || loading}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-5 pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
            disabled={isSubmitting || loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting || loading ? 'Saving...' : editingSource ? 'Update Source' : 'Add Source'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddLeadSourceForm;