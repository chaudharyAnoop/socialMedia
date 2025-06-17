// // utils/formatters.ts
// export const formatNumber = (num: number): string => {
//   if (num >= 1000000) {
//     return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
//   }
//   if (num >= 1000) {
//     return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
//   }
//   return num.toString();
// };

// export const formatTimeAgo = (date: Date): string => {
//   const now = new Date();
//   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
//   if (diffInSeconds < 60) {
//     return `${diffInSeconds}s`;
//   } else if (diffInSeconds < 3600) {
//     return `${Math.floor(diffInSeconds / 60)}m`;
//   } else if (diffInSeconds < 86400) {
//     return `${Math.floor(diffInSeconds / 3600)}h`;
//   } else if (diffInSeconds < 604800) {
//     return `${Math.floor(diffInSeconds / 86400)}d`;
//   } else {
//     return `${Math.floor(diffInSeconds / 604800)}w`;
//   }
// };

// utils/formatters.ts - Complete Fixed Version
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

export const formatTimeAgo = (date: Date | string | number | null | undefined): string => {
  try {
    // Handle null/undefined cases
    if (!date) {
      return 'now';
    }

    // Convert to Date object if it's not already
    let dateObj: Date;
    
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (typeof date === 'number') {
      // Assume it's a timestamp
      dateObj = new Date(date);
    } else {
      // Fallback for unexpected types
      console.warn('Invalid date format:', date);
      return 'now';
    }
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date:', date);
      return 'now';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    } else {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks}w`;
    }
  } catch (error) {
    console.error('Error in formatTimeAgo:', error, 'Date:', date);
    return 'now';
  }
};