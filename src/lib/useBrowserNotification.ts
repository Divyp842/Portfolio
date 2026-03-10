/**
 * Browser Notification Hook
 * Handles requesting permission and showing desktop notifications
 */

export const useBrowserNotification = () => {
  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notifications");
      return "denied";
    }

    if (Notification.permission === "granted") {
      return "granted";
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  };

  const showNotification = (
    title: string,
    options?: NotificationOptions,
  ): Notification | null => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return null;
    }

    try {
      return new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      });
    } catch (error) {
      console.error("Failed to show notification:", error);
      return null;
    }
  };

  const showNewMessageNotification = (senderName: string, preview: string) => {
    return showNotification(`📧 New Message from ${senderName}`, {
      body: preview.substring(0, 100) + (preview.length > 100 ? "..." : ""),
      tag: "new-message",
      requireInteraction: true,
    });
  };

  return {
    requestPermission,
    showNotification,
    showNewMessageNotification,
  };
};
