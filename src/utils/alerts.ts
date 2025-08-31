// Client-side only SweetAlert2 getter with dynamic import
const getSwal = async () => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const { default: Swal } = await import('sweetalert2');
    return Swal;
  } catch (error) {
    console.warn('SweetAlert2 could not be loaded:', error);
    return null;
  }
};

// Success alert
export const showSuccess = async (title: string, text?: string) => {
  const swal = await getSwal();
  if (!swal) return { isConfirmed: false };
  
  return swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#10b981',
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false
  });
};

// Error alert
export const showError = async (title: string, text?: string) => {
  const swal = await getSwal();
  if (!swal) return { isConfirmed: false };
  
  return swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'OK'
  });
};

// Warning alert
export const showWarning = async (title: string, text?: string) => {
  const swal = await getSwal();
  if (!swal) return { isConfirmed: false };
  
  return swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonColor: '#f59e0b',
    confirmButtonText: 'OK'
  });
};

// Info alert
export const showInfo = async (title: string, text?: string) => {
  const swal = await getSwal();
  if (!swal) return { isConfirmed: false };
  
  return swal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonColor: '#3b82f6',
    confirmButtonText: 'OK'
  });
};

// Confirmation dialog
export const showConfirm = async (title: string, text?: string) => {
  const swal = await getSwal();
  if (!swal) return { isConfirmed: false };
  
  return swal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  });
};

// Loading alert
export const showLoading = async (title: string = 'Loading...') => {
  const swal = await getSwal();
  if (!swal) return { isConfirmed: false };
  
  return swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      swal.showLoading();
    }
  });
};

// Close loading alert
export const closeLoading = async () => {
  const swal = await getSwal();
  if (!swal) return;
  
  swal.close();
};

// Toast notification
export const showToast = async (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  const swal = await getSwal();
  if (!swal) return { isConfirmed: false };
  
  const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      // Add null check to prevent addEventListener errors
      if (toast && typeof toast.addEventListener === 'function') {
        toast.addEventListener('mouseenter', swal.stopTimer);
        toast.addEventListener('mouseleave', swal.resumeTimer);
      }
    }
  });

  return Toast.fire({
    icon,
    title
  });
};

// Custom styled alert for the jewelry theme
export const showJewelryAlert = async (title: string, text?: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  const swal = await getSwal();
  if (!swal) return { isConfirmed: false };
  
  return swal.fire({
    icon,
    title,
    text,
    background: '#fefefe',
    color: '#1f2937',
    confirmButtonColor: '#d97706',
    confirmButtonText: 'OK',
    customClass: {
      popup: 'jewelry-alert',
      title: 'jewelry-alert-title'
    }
  });
};