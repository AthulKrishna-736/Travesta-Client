import { toast } from 'sonner';

export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 2000,
    position: 'top-right',
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    duration: 2000,
    position: 'top-right',
  });
};

export const showInfo = (message: string) => {
  toast(message, {
    duration: 2000,
    position: 'top-right',
  });
};
