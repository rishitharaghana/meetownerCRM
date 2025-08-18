import React, { useState, useEffect } from 'react';
import { Plus, Database, Edit2, Trash2 } from 'lucide-react';

interface LeadSource {
  id: string;
  name: string;
  dateAdded: string;
}

function LeadSource() {
  const [currentPage, setCurrentPage] = useState<'add' | 'list'>('list');
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [editingSource, setEditingSource] = useState<LeadSource | null>(null);

  useEffect(() => {
    const savedSources = localStorage.getItem('leadSources');
    if (savedSources) {
      setLeadSources(JSON.parse(savedSources));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('leadSources', JSON.stringify(leadSources));
  }, [leadSources]);

  const addLeadSource = (source: Omit<LeadSource, 'id' | 'dateAdded'>) => {
    const newSource: LeadSource = {
      ...source,
      id: Date.now().toString(),
      dateAdded: new Date().toLocaleDateString(),
    };
    setLeadSources(prev => [...prev, newSource]);
  };

  const updateLeadSource = (updatedSource: LeadSource) => {
    setLeadSources(prev =>
      prev.map(source => (source.id === updatedSource.id ? updatedSource : source))
    );
    setEditingSource(null);
  };

  const deleteLeadSource = (id: string) => {
    setLeadSources(prev => prev.filter(source => source.id !== id));
  };

  const handleEdit = (source: LeadSource) => {
    setEditingSource(source);
    setCurrentPage('add');
  };

  const handleAddNew = () => {
    setEditingSource(null);
    setCurrentPage('add');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Source Management</h1>
          <p className="text-gray-600">Manage your lead sources efficiently</p>
        </div>

        {/* Navigation */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm border">
          <button
            onClick={() => setCurrentPage('list')}
            className={`flex items-center px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              currentPage === 'list'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Database className="w-4 h-4 mr-2" />
            All Sources
          </button>
          <button
            onClick={handleAddNew}
            className={`flex items-center px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              currentPage === 'add'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Source
          </button>
        </div>

        {/* Content */}
        {currentPage === 'add' ? (
          <AddLeadSourceForm
            onSubmit={editingSource ? updateLeadSource : addLeadSource}
            onCancel={() => {
              setCurrentPage('list');
              setEditingSource(null);
            }}
            editingSource={editingSource}
          />
        ) : (
          <LeadSourcesList
            sources={leadSources}
            onEdit={handleEdit}
            onDelete={deleteLeadSource}
            onAddNew={handleAddNew}
          />
        )}
      </div>
    </div>
  );
}

interface AddLeadSourceFormProps {
  onSubmit: (source: Omit<LeadSource, 'id' | 'dateAdded'> | LeadSource) => void;
  onCancel: () => void;
  editingSource?: LeadSource | null;
}

function AddLeadSourceForm({ onSubmit, onCancel, editingSource }: AddLeadSourceFormProps) {
  const [formData, setFormData] = useState({
    name: editingSource?.name || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get existing lead sources from localStorage
  const [existingSources, setExistingSources] = useState<LeadSource[]>([]);
  
  useEffect(() => {
    const savedSources = localStorage.getItem('leadSources');
    if (savedSources) {
      setExistingSources(JSON.parse(savedSources));
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Source name is required';
    } else if (!editingSource) {
      // Check for duplicate names only when adding new source (not editing)
      const isDuplicate = existingSources.some(
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (editingSource) {
      onSubmit({
        ...editingSource,
        ...formData,
      });
    } else {
      onSubmit(formData);
    }
    
    setFormData({ name: '' });
    setIsSubmitting(false);
    onCancel();
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
        {/* Show existing lead sources */}
        {!editingSource && existingSources.length > 0 && (
          <div className="mb-8 p-4 bg-blue-900 border border-blue-900 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">Existing Lead Sources ({existingSources.length})</h3>
            <div className="flex flex-wrap gap-2">
              {existingSources.map((source) => (
                <span
                  key={source.id}
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
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-5 pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'Saving...' : editingSource ? 'Update Source' : 'Add Source'}
          </button>
        </div>
      </form>
    </div>
  );
}

interface LeadSourcesListProps {
  sources: LeadSource[];
  onEdit: (source: LeadSource) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

function LeadSourcesList({ sources, onEdit, onDelete, onAddNew }: LeadSourcesListProps) {
  if (sources.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="text-center py-16">
          <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Lead Sources Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first lead source to track where your leads come from.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Lead Sources</h2>
            <p className="text-gray-600 mt-1">{sources.length} source{sources.length !== 1 ? 's' : ''} configured</p>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Source Name</th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Date Added</th>
              <th className="px-8 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sources.map((source) => (
              <tr key={source.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-4">
                  <div className="font-medium text-gray-900">{source.name}</div>
                </td>
                <td className="px-8 py-4 text-gray-600">
                  {source.dateAdded}
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(source)}
                      className="inline-flex items-center p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit source"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this lead source?')) {
                          onDelete(source.id);
                        }
                      }}
                      className="inline-flex items-center p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete source"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeadSource;