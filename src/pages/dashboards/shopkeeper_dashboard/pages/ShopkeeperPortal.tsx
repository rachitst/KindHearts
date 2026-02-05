import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { navigate } from '../store/slices/navigationSlice';
import { loginSuccess } from '../store/slices/authSlice';
import { User } from '../types';
import { config } from '../../../../config/env';
import { 
  Store, 
  Shield, 
  CheckCircle, 
  Building2, 
  Phone, 
  Mail, 
  MapPin,
  User as UserIcon
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';

const ShopkeeperPortal = () => {
  const dispatch = useDispatch();
  const { user, isLoaded } = useUser();
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    businessType: 'retail',
    agreeToTerms: false
  });

  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const checkShop = async () => {
        if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
            const email = user.primaryEmailAddress.emailAddress;
            try {
                // Check if shop exists
                const res = await fetch(`${config.apiBaseUrl}/api/shops?email=${email}`);
                const data = await res.json();
                
                if (data.success && data.shops && data.shops.length > 0) {
                    const shop = data.shops[0];
                     const userData: User = {
                      id: shop._id || `USER-${Date.now()}`,
                      name: shop.owner,
                      email: shop.email,
                      role: 'shopkeeper',
                      shopId: shop._id,
                      shopName: shop.name,
                      phone: shop.phone || "",
                      address: shop.location
                    };
                    dispatch(loginSuccess(userData));
                    dispatch(navigate('dashboard'));
                } else {
                    // Pre-fill form
                    setFormData(prev => ({
                        ...prev,
                        email: email,
                        ownerName: user.fullName || ""
                    }));
                }
            } catch (e) { console.error("Error checking shop:", e); }
        }
    }
    checkShop();
  }, [isLoaded, user, dispatch]);

  const features = [
    {
      icon: Store,
      title: 'Manage Donations',
      description: 'Efficiently handle educational material donations'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data is protected with industry-standard security'
    },
    {
      icon: CheckCircle,
      title: 'Easy Process',
      description: 'Simple and streamlined donation management'
    }
  ];

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const shopkeeperData = {
      ...formData,
      registeredAt: new Date().toISOString()
    };
    localStorage.setItem('shopkeeperData', JSON.stringify(shopkeeperData));

    let shopId: string | undefined;
    try {
      const res = await fetch(`${config.apiBaseUrl}/api/shops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.shopName,
          location: formData.address,
          coordinates: coordinates || [0, 0],
          owner: formData.ownerName,
          email: formData.email,
          phone: formData.phone
        })
      });
      const data = await res.json();
      if (res.ok && data.shop?._id) {
        shopId = data.shop._id;
      }
    } catch {
      // ignore and proceed without shopId
    }

    const userData: User = {
      id: `USER-${Date.now()}`,
      name: formData.ownerName,
      email: formData.email,
      role: 'shopkeeper',
      shopId,
      shopName: formData.shopName,
      phone: formData.phone,
      address: formData.address
    };

    dispatch(loginSuccess(userData));
    dispatch(navigate('dashboard'));
  }, [formData, dispatch]);

  const InputField = useCallback(({ 
    icon: Icon, 
    label, 
    type, 
    name,
    placeholder, 
    value, 
    onChange, 
    required = true 
  }: {
    icon: LucideIcon;
    label: string;
    type: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (name: string, value: string) => void;
    required?: boolean;
  }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative flex items-center">
        <Icon className="absolute left-4 text-gray-400 pointer-events-none" size={18} />
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   text-gray-700 text-sm transition-all duration-200
                   placeholder:text-gray-400"
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>
    </div>
  ), []);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange('address', e.target.value);
  }, [handleInputChange]);

  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('agreeToTerms', e.target.checked);
  }, [handleInputChange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Features */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 lg:p-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-md mx-auto"
              >
                <h2 className="text-3xl font-bold text-white mb-6">
                  Welcome to ShopKeeper
                </h2>
                <p className="text-blue-100 mb-8">
                  Join our platform to manage your donations and make a difference in education.
                </p>
                
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      <feature.icon className="w-6 h-6 text-blue-200 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                        <p className="text-blue-200 text-sm">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 lg:p-12">
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-6 max-w-md mx-auto"
              >
                <InputField
                  icon={Building2}
                  label="Shop Name"
                  type="text"
                  name="shopName"
                  placeholder="Enter your shop name"
                  value={formData.shopName}
                  onChange={handleInputChange}
                />

                <InputField
                  icon={UserIcon}
                  label="Owner Name"
                  type="text"
                  name="ownerName"
                  placeholder="Enter owner name"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField
                    icon={Mail}
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />

                  <InputField
                    icon={Phone}
                    label="Phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-gray-400 pointer-events-none" size={18} />
                    <textarea
                      id="address"
                      required
                      value={formData.address}
                      onChange={handleTextareaChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 
                               text-gray-700 text-sm transition-all duration-200
                               placeholder:text-gray-400"
                      placeholder="Enter your address"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={formData.agreeToTerms}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 
                             focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                    I agree to the terms and conditions
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 
                           text-white rounded-xl font-medium shadow-lg 
                           hover:shadow-blue-500/30 focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:ring-offset-2 
                           transition-all duration-200"
                >
                  Register as Shopkeeper
                </motion.button>
              </motion.form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShopkeeperPortal; 
