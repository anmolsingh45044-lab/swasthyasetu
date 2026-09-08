const Notification = require('../models/Notification');

const createNotification = async ({ user, title, message, type = 'info' }) => {
  try {
    return await Notification.create({ user, title, message, type });
  } catch (err) {
    console.error('[NotificationService] Failed to create notification:', err.message);
    return null;
  }
};

module.exports = { createNotification };
