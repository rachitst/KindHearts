const handleSubmit = async (formData: any) => {
  try {
    // Combine all form data
    const finalData = {
      ...basicInfo,
      ...contactInfo,
      ...legalInfo,
      ...formData
    };

    // Use the new registerAndLogin function
    await registerAndLogin(finalData);
    
    // No need to navigate, AuthContext will handle it
  } catch (error) {
    console.error('Registration failed:', error);
    setError('Registration failed. Please try again.');
  }
}; 