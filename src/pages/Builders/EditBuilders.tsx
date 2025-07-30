import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import { AppDispatch, RootState } from '../../store/store';
import { updateUser, clearMessages, clearUsers } from '../../store/slices/userslice'; // Add setUsers
import { usePropertyQueries } from '../../hooks/PropertyQueries';
import { setCityDetails } from '../../store/slices/propertyDetails';
import ComponentCard from '../../components/common/ComponentCard';
import PageMeta from '../../components/common/PageMeta';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';

interface Option {
  value: string;
  text: string;
}

const statusOptions: Option[] = [
  { value: '1', text: 'Approved' },
  { value: '2', text: 'Rejected' },
];

const EditBuilder: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { userDetails } = location.state || {};
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { states, cities } = useSelector((state: RootState) => state.property);
  const { updateLoading, updateError, updateSuccess, users } = useSelector((state: RootState) => state.user);
  const { citiesQuery } = usePropertyQueries();

  const [selectedBuilder, setSelectedBuilder] = useState<any>({
    id: userDetails?.id || '',
    aadhar_number: userDetails?.aadhar_number || '',
    pan_card_number: userDetails?.pan_card_number || '',
    gst_number: userDetails?.gst_number || '',
    company_name: userDetails?.company_name || '',
    company_number: userDetails?.company_number || '',
    company_address: userDetails?.company_address || '',
    representative_name: userDetails?.representative_name || '',
    name: userDetails?.name || '',
    mobile: userDetails?.mobile || '',
    email: userDetails?.email || '',
    state: userDetails?.state || '',
    city: userDetails?.city || '',
    location: userDetails?.location || '',
    address: userDetails?.address || '',
    pincode: userDetails?.pincode || '',
    rera_number: userDetails?.rera_number || '',
    status: userDetails?.status || '',
    user_type: userDetails?.user_type || 2,
  });
  const [feedback, setFeedback] = useState<string>(userDetails?.feedback || '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);
  const [selectedState, setSelectedState] = useState<string>(
    userDetails?.state
      ? states?.find((s: any) => s.label.toLowerCase() === userDetails.state.toLowerCase())?.value?.toString() || ''
      : ''
  );

  const stateOptions: Option[] =
    states?.map((state: any) => ({
      value: state.value.toString(),
      text: state.label,
    })) || [];

  const citiesResult = citiesQuery(selectedState ? parseInt(selectedState) : undefined);
  const cityOptions: Option[] =
    citiesResult?.data?.map((city: any) => ({
      value: city.value.toString(),
      text: city.label,
    })) || [];

  // Check if user is a Builder
  useEffect(() => {
    if (userDetails && userDetails.user_type !== 2) {
      toast.error('This page can only edit Builders (user_type 2)');
      navigate('/builders');
    }
  }, [userDetails, navigate]);

  // Sync cities to Redux
  useEffect(() => {
    if (citiesResult.data) {
      dispatch(setCityDetails(citiesResult.data));
    }
  }, [citiesResult.data, dispatch]);

  // Handle city fetch errors
  useEffect(() => {
    if (citiesResult.isError) {
      toast.error(`Failed to fetch cities: ${citiesResult.error?.message || 'Unknown error'}`);
    }
  }, [citiesResult.isError, citiesResult.error]);



useEffect(() => {
    if (updateSuccess) {
      toast.success("Builder updated successfully");
      setTimeout(() => {
        navigate(`/builders`);
        dispatch(clearMessages());
      }, 1000);
    }
  }, [updateSuccess, navigate, dispatch, selectedBuilder]);

  // Handle update errors
  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
    }
  }, [updateError]);

  const getCityValue = (text: string) => {
    const option = cityOptions.find((opt) => opt.text.toLowerCase() === text.toLowerCase());
    return option ? option.value : '';
  };

  const getStateValue = (text: string) => {
    const option = stateOptions.find((opt) => opt.text.toLowerCase() === text.toLowerCase());
    return option ? option.value : '';
  };

  // Check for duplicate mobile or email
  const checkDuplicate = async (field: 'mobile' | 'email', value: string) => {
    try {
      const response = await axios.get(`http://localhost:3002/api/v1/users/check-duplicate`, {
        params: { field, value, excludeId: id },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data.exists;
    } catch (error) {
      console.error(`Error checking duplicate ${field}:`, error);
      return false;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuilder) {
      toast.error('No builder selected');
      return;
    }
    if (!user?.user_type || !user?.id) {
      toast.error('User authentication data missing');
      return;
    }

    const createdUserIdRaw = localStorage.getItem('userId') || user.id.toString();
    const statusValue = parseInt(selectedBuilder.status) || 0;

    // Validate feedback
    if (statusValue === 2 && !feedback.trim()) {
      toast.error('Feedback is required when rejecting a builder');
      return;
    }
    if ([0, 1].includes(statusValue) && feedback.trim()) {
      toast.error('Feedback must be empty when status is Approved or Pending');
      return;
    }

    // Validate required fields
    if (
      !selectedBuilder.name ||
      !selectedBuilder.mobile ||
      !selectedBuilder.email ||
      !selectedBuilder.state ||
      !selectedBuilder.city ||
      !selectedBuilder.location ||
      !selectedBuilder.pincode
    ) {
      toast.error('All required fields must be filled');
      return;
    }

    // Validate mobile
    if (!/^\d{10}$/.test(selectedBuilder.mobile)) {
      toast.error('Mobile must be a 10-digit number');
      return;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedBuilder.email)) {
      toast.error('Invalid email format');
      return;
    }

    // Validate pincode
    if (!/^\d{6}$/.test(selectedBuilder.pincode)) {
      toast.error('Pincode must be a 6-digit number');
      return;
    }

    // Validate optional fields
    if (selectedBuilder.aadhar_number && !/^\d{12}$/.test(selectedBuilder.aadhar_number)) {
      toast.error('Aadhar number must be a 12-digit number');
      return;
    }
    if (selectedBuilder.pan_card_number && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(selectedBuilder.pan_card_number)) {
      toast.error('PAN card number must follow the format ABCDE1234F');
      return;
    }
    if (selectedBuilder.gst_number && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(selectedBuilder.gst_number)) {
      toast.error('Invalid GST number format');
      return;
    }

    // Check for duplicates
    const mobileExists = await checkDuplicate('mobile', selectedBuilder.mobile);
    const emailExists = await checkDuplicate('email', selectedBuilder.email);
    if (mobileExists && emailExists) {
      toast.error('Both mobile and email already exist for another user');
      return;
    } else if (mobileExists) {
      toast.error('Mobile already exists for another user');
      return;
    } else if (emailExists) {
      toast.error('Email already exists for another user');
      return;
    }

    const formData = new FormData();
    formData.append('name', selectedBuilder.name);
    formData.append('mobile', selectedBuilder.mobile);
    formData.append('email', selectedBuilder.email);
    formData.append('state', selectedBuilder.state);
    formData.append('city', selectedBuilder.city);
    formData.append('location', selectedBuilder.location);
    formData.append('address', selectedBuilder.address || '');
    formData.append('pincode', selectedBuilder.pincode);
    formData.append('rera_number', selectedBuilder.rera_number || '');
    formData.append('gst_number', selectedBuilder.gst_number || '');
    formData.append('company_name', selectedBuilder.company_name || '');
    formData.append('company_number', selectedBuilder.company_number || '');
    formData.append('company_address', selectedBuilder.company_address || '');
    formData.append('representative_name', selectedBuilder.representative_name || '');
    formData.append('pan_card_number', selectedBuilder.pan_card_number || '');
    formData.append('aadhar_number', selectedBuilder.aadhar_number || '');
    formData.append('status', statusValue.toString());
    formData.append('feedback', statusValue === 2 ? feedback : '');
    formData.append('created_user_id', createdUserIdRaw);
    formData.append('created_user_type', user.user_type.toString());

    if (photoFile) {
      formData.append('photo', photoFile);
    }
    if (companyLogoFile) {
      formData.append('company_logo', companyLogoFile);
    }

    console.log('FormData:', Object.fromEntries(formData));

    dispatch(updateUser({ id: selectedBuilder.id, formData }));
  };

  const handleInputChange = (field: string, value: string) => {
    if (selectedBuilder) {
      setSelectedBuilder({ ...selectedBuilder, [field]: value });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleCompanyLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCompanyLogoFile(e.target.files[0]);
    }
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    handleInputChange('city', '');
    const selectedOption = stateOptions.find((opt) => opt.value === value);
    handleInputChange('state', selectedOption?.text || '');
  };

  const handleCancel = () => {
    navigate('/builders');
  };

  if (!selectedBuilder || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          No Builder Selected or Not Authenticated
        </h2>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <PageMeta title="Edit Builder" />
      <ComponentCard title="Edit Builder">
        <form onSubmit={handleSave} className="space-y-6">
          {updateSuccess && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md">
              Builder updated successfully
            </div>
          )}
          {updateError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {updateError}
            </div>
          )}
          <div className="min-h-[80px]">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={selectedBuilder.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter builder name"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              type="text"
              id="mobile"
              value={selectedBuilder.mobile || ''}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              placeholder="Enter mobile number"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="email">Email ID</Label>
            <Input
              type="email"
              id="email"
              value={selectedBuilder.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="example@domain.com"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="state">State</Label>
            <select
              id="state"
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              disabled={updateLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Select State</option>
              {stateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="city">City</Label>
            <select
              id="city"
              value={getCityValue(selectedBuilder.city || '')}
              onChange={(e) => {
                const selectedOption = cityOptions.find((opt) => opt.value === e.target.value);
                handleInputChange('city', selectedOption?.text || '');
              }}
              disabled={updateLoading || !selectedState}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Select City</option>
              {cityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              id="location"
              value={selectedBuilder.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter location"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              type="text"
              id="address"
              value={selectedBuilder.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter address"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              type="text"
              id="pincode"
              value={selectedBuilder.pincode || ''}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              placeholder="Enter pincode"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="rera_number">RERA Number (Optional)</Label>
            <Input
              type="text"
              id="rera_number"
              value={selectedBuilder.rera_number || ''}
              onChange={(e) => handleInputChange('rera_number', e.target.value)}
              placeholder="Enter RERA number"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="gst_number">GST Number (Optional)</Label>
            <Input
              type="text"
              id="gst_number"
              value={selectedBuilder.gst_number || ''}
              onChange={(e) => handleInputChange('gst_number', e.target.value)}
              placeholder="Enter GST number"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="company_name">Company Name (Optional)</Label>
            <Input
              type="text"
              id="company_name"
              value={selectedBuilder.company_name || ''}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              placeholder="Enter company name"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="company_number">Company Number (Optional)</Label>
            <Input
              type="text"
              id="company_number"
              value={selectedBuilder.company_number || ''}
              onChange={(e) => handleInputChange('company_number', e.target.value)}
              placeholder="Enter company number"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="company_address">Company Address (Optional)</Label>
            <Input
              type="text"
              id="company_address"
              value={selectedBuilder.company_address || ''}
              onChange={(e) => handleInputChange('company_address', e.target.value)}
              placeholder="Enter company address"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="representative_name">Representative Name (Optional)</Label>
            <Input
              type="text"
              id="representative_name"
              value={selectedBuilder.representative_name || ''}
              onChange={(e) => handleInputChange('representative_name', e.target.value)}
              placeholder="Enter representative name"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="pan_card_number">PAN Card Number (Optional)</Label>
            <Input
              type="text"
              id="pan_card_number"
              value={selectedBuilder.pan_card_number || ''}
              onChange={(e) => handleInputChange('pan_card_number', e.target.value)}
              placeholder="Enter PAN card number (e.g., ABCDE1234F)"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="aadhar_number">Aadhar Number (Optional)</Label>
            <Input
              type="text"
              id="aadhar_number"
              value={selectedBuilder.aadhar_number || ''}
              onChange={(e) => handleInputChange('aadhar_number', e.target.value)}
              placeholder="Enter Aadhar number (12 digits)"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="photo">Photo (Optional)</Label>
            <Input
              type="file"
              id="photo"
              accept=".jpg,.jpeg,.png"
              onChange={handlePhotoChange}
              disabled={updateLoading}
            />
            {selectedBuilder.photo && !photoFile && (
              <img
                src={selectedBuilder.photo}
                alt="Current builder photo"
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            )}
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="company_logo">Company Logo (Optional)</Label>
            <Input
              type="file"
              id="company_logo"
              accept=".jpg,.jpeg,.png"
              onChange={handleCompanyLogoChange}
              disabled={updateLoading}
            />
            {selectedBuilder.company_logo && !companyLogoFile && (
              <img
                src={selectedBuilder.company_logo}
                alt="Current company logo"
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            )}
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={selectedBuilder.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
              disabled={updateLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Select Status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>
          {selectedBuilder.status === '2' && (
            <div className="min-h-[80px]">
              <Label htmlFor="feedback">Feedback (Required for Rejected Status)</Label>
              <Input
                type="text"
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter feedback for rejection"
                disabled={updateLoading}
              />
            </div>
          )}
          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              size="md"
              onClick={handleCancel}
              disabled={updateLoading}
              className="w-[30%] bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={updateLoading}
              className="w-[30%] bg-[#1D3A76] text-white hover:bg-blue-700"
            >
              {updateLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default EditBuilder;