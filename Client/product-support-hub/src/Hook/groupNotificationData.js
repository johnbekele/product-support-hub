const groupNotificationsByDate = (notifications) => {
  const today = [];
  const yesterday = [];
  const thisWeek = [];
  const older = [];

  notifications.forEach((notification) => {
    const date = parseISO(notification.createdAt);

    if (isToday(date)) {
      today.push(notification);
    } else if (isYesterday(date)) {
      yesterday.push(notification);
    } else if (isThisWeek(date)) {
      thisWeek.push(notification);
    } else {
      older.push(notification);
    }
  });

  return { today, yesterday, thisWeek, older };
};

export default groupNotificationsByDate;
