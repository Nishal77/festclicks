import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Toast with dark theme styling
const toastOptions = {
  duration: 4000,
  style: {
    background: '#333',
    color: '#fff',
    padding: '16px',
    borderRadius: '8px',
  },
  success: {
    iconTheme: {
      primary: '#10B981',
      secondary: '#FFFFFF'
    }
  },
  error: {
    iconTheme: {
      primary: '#EF4444',
      secondary: '#FFFFFF'
    },
    style: {
      background: '#3D1113',
      color: '#FFA5A5',
    }
  },
  loading: {
    iconTheme: {
      primary: '#60A5FA',
      secondary: '#FFFFFF'
    }
  }
};

// Toast functions
export const showSuccessToast = (message) => {
  toast.success(message, toastOptions);
};

export const showErrorToast = (message) => {
  toast.error(message, toastOptions);
};

export const showInfoToast = (message) => {
  toast(message, toastOptions);
};

export const showLoadingToast = (message) => {
  return toast.loading(message, toastOptions);
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Toast Container Component
const Toast = () => {
  return (
    <Toaster 
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Override default toast styling
        className: '',
        duration: 4000,
        style: {
          background: '#333',
          color: '#fff',
        },
      }}
    />
  );
};

export default Toast; 