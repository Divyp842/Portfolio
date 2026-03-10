import toast from "react-hot-toast";

/**
 * Custom notification hook with auto-scroll to top functionality
 * Provides better UX by scrolling to visible notification area
 */
export const useNotification = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      left: 0,
    });
  };

  return {
    success: (message: string) => {
      scrollToTop();
      toast.success(message, {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#10b981",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "600",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(16, 185, 129, 0.2)",
          padding: "16px 20px",
          border: "none",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#10b981",
        },
      });
    },

    error: (message: string) => {
      scrollToTop();
      toast.error(message, {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#ef4444",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "600",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(239, 68, 68, 0.2)",
          padding: "16px 20px",
          border: "none",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#ef4444",
        },
      });
    },

    loading: (message: string) => {
      return toast.loading(message, {
        duration: Infinity,
        position: "top-right",
        style: {
          background: "#3b82f6",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "600",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(59, 130, 246, 0.2)",
          padding: "16px 20px",
          border: "none",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#3b82f6",
        },
      });
    },

    promise: <T>(
      promise: Promise<T>,
      messages: { loading: string; success: string; error: string },
    ) => {
      scrollToTop();
      return toast.promise(promise, messages, {
        duration: 4000,
        position: "top-right",
        style: {
          fontSize: "14px",
          fontWeight: "600",
          borderRadius: "12px",
          padding: "16px 20px",
          border: "none",
        },
      });
    },

    info: (message: string) => {
      scrollToTop();
      return toast(message, {
        duration: 4000,
        position: "top-right",
        icon: "ℹ️",
        style: {
          background: "#06b6d4",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "600",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(6, 182, 212, 0.2)",
          padding: "16px 20px",
          border: "none",
        },
      });
    },
  };
};
