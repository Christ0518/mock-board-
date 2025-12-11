import Swal from 'sweetalert2';

export default function SweetAlert2(
  title,
  text,
  icon,
  showConfirmButton = true, ok,
  showCancelButton = false, cancel,
  showLoading = false
) {
  const isProcess = icon === 'process';

  // Detect dark mode
  // const isDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

  return Swal.fire({
    title,
    text,
    icon: isProcess ? undefined : icon,
    showConfirmButton: showConfirmButton && !showLoading,
    showCancelButton,
    confirmButtonText: ok,
    cancelButtonText: cancel,
    allowOutsideClick: false,
    background: '#1A54B8',  
    color: '#fff',         
    didOpen: () => {
      if (showLoading || isProcess) {
        Swal.showLoading();
      }
    }
  });
}
