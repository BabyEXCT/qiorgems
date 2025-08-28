import Swal from 'sweetalert2';

// Success alert
export const showSuccess = (title: string, text?: string) => {
  return Swal.fire({
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
export const showError = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'OK'
  });
};

// Warning alert
export const showWarning = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonColor: '#f59e0b',
    confirmButtonText: 'OK'
  });
};

// Info alert
export const showInfo = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonColor: '#3b82f6',
    confirmButtonText: 'OK'
  });
};

// Confirmation dialog
export const showConfirm = (title: string, text?: string) => {
  return Swal.fire({
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
export const showLoading = (title: string = 'Loading...') => {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Close loading alert
export const closeLoading = () => {
  Swal.close();
};

// Toast notification
export const showToast = (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  return Toast.fire({
    icon,
    title
  });
};

// Custom styled alert for the jewelry theme
export const showJewelryAlert = (title: string, text?: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  return Swal.fire({
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