// src/components/Support.tsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';
import { useNavigate } from 'react-router';
import { AppDispatch, RootState } from '../../store/store';
import { InsertBuilderQueryRequest } from '../../types/BuilderModel';
import { createBuilderQuery } from '../../store/slices/builderslice';

const faqs = [
  { question: "How do I reset my password?", answer: "Go to the login page and click 'Forgot Password' to reset it via email." },
  { question: "What are the support hours?", answer: "Support is available Monday to Friday, 9 AM to 6 PM IST." },
  { question: "How can I contact sales?", answer: "Reach out to sales@yourdomain.com or call +91-9876543210." },
];

const Support: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector((state: RootState) => state.builder);
  const [formData, setFormData] = useState<InsertBuilderQueryRequest>({
    name: '',
    number: '',
    message: '',
    admin_user_id: user?.created_user_id ?? 0, 
    admin_user_type: user?.created_user_type ?? 1, 
    added_user_id: user?.id ?? 0, 
    added_user_type: user?.user_type ?? 2, 
  });
  const [currentDate] = useState(
    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })
  );
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user || user.user_type !== 2 || !user.id) {
      toast.error('Please log in as builder to submit a query');
      return;
    }

    if (!formData.name || !formData.number || !formData.message) {
      toast.error('All fields are required');
      return;
    }

    if (!/^\d{10}$/.test(formData.number)) {
      toast.error('Number must be a 10-digit phone number');
      return;
    }

    
    const submitData: InsertBuilderQueryRequest = {
      ...formData,
    admin_user_id: user?.created_user_id ?? 0, 
    admin_user_type: user?.created_user_type ?? 1, 
    };

    try {
      await dispatch(createBuilderQuery(submitData)).unwrap();
      setFormData({
        name: '',
        number: '',
        message: '',
         admin_user_id: user?.created_user_id ?? 0, 
    admin_user_type: user?.created_user_type ?? 1, 
    added_user_id: user?.id ?? 0, 
    added_user_type: user?.user_type ?? 2, 
      });
    } catch (error) {
      
    }
  };

  // Determine if the form is valid for enabling the submit button
  const isFormValid = formData.name && formData.number && /^\d{10}$/.test(formData.number) && formData.message;

  return (
    <div className="min-h-screen p-4">
      <ComponentCard title="Get Support">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-600 text-sm mb-4">
              Our team is here to assist you. Last updated: {currentDate}.
            </p>
            <p className="text-gray-600 text-sm">
              Email: <a href="mailto:support@meetowner.in" className="text-blue-600 hover:underline">support@meetowner.in</a> | Phone: +91-9876543210
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Submit a Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="supportName">Name</Label>
                <Input
                  type="text"
                  id="supportName"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="dark:bg-dark-900"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="supportNumber">Phone Number</Label>
                <Input
                  type="text"
                  id="supportNumber"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className="dark:bg-dark-900"
                  placeholder="Enter your 10-digit phone number"
                />
              </div>
              <div>
                <Label htmlFor="supportMessage">Message</Label>
                <textarea
                  id="supportMessage"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md dark:bg-dark-900"
                  placeholder="Describe your issue"
                  rows={4}
                />
              </div>
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={loading ||  !isFormValid}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b pb-2">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full text-left text-md font-medium text-gray-800 dark:text-white/90 flex justify-between items-center"
                  >
                    {faq.question}
                    <span className="text-gray-500 text-xs">
                      {expandedFAQ === index ? '▲' : '▼'}
                    </span>
                  </button>
                  {expandedFAQ === index && (
                    <p className="text-gray-600 text-sm mt-2 transition-all duration-300 ease-in-out">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                Back
              </Button>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};

export default Support;