export interface ToastInterface {
  toast?: Boolean
  icon?: String
  title?: String
  animation?: Boolean
  position?: String
  showConfirmButton?: Boolean
  timer?: Number
  timerProgressBar?: Boolean
  text?: String
  showCancelButton?: Boolean
  confirmButtonText?: String
  cancelButtonText?: String
  cancelButtonColor?: String
  confirmButtonColor?: String
}

export default function (Swal: any) {
  return Swal.mixin({
    toast: true,
    icon: 'success',
    title: 'General Title',
    animation: false,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast: any) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
  })
}

export const showToast = (SwalInstance: any, options: ToastInterface) => {
  return SwalInstance.fire({
    toast: options.toast || true,
    icon: options.icon || 'success',
    title: options.title || '',
    animation: options.animation || false,
    position: options.position || 'bottom',
    showConfirmButton: options.showConfirmButton || false,
    timer: options.timer || 3000,
    timerProgressBar: options.timerProgressBar || true,
  })
}

export const showConfirmDialog = (
  SwalInstance: any,
  options: ToastInterface
) => {
  return SwalInstance.fire({
    title: options.title,
    text: options.text,
    icon: options.icon || 'warning',
    showCancelButton: options.showCancelButton || true,
    confirmButtonText: options.confirmButtonText || `Yes, I'm Sure`,
    cancelButtonText: options.cancelButtonText || 'Cancel',
    cancelButtonColor: options.cancelButtonColor || '#1976d2',
    confirmButtonColor: options.confirmButtonColor || '#fb8c00',
  })
}
