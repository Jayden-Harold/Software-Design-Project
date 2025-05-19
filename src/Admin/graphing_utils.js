export function countReports(docs, cutoffDate) {
    const counts = {};
  
    docs.forEach(doc => {
      const data = doc.data?.();
      const status = data?.Status?.toLowerCase?.();
      const facility = data?.facility || '';
      const reportedDate = data?.ReportedDate?.toDate?.();
  
      if (reportedDate && status !== 'complete' && reportedDate >= cutoffDate) {
        counts[facility] = (counts[facility] || 0) + 1;
      }
    });
  
    return counts;
  }
  
  export function countStatusByCategory(docs, cutoffDate) {
    const statusCounts = {
      Open: 0,
      "In Progress": 0,
      Closed: 0
    };
  
    docs.forEach(doc => {
      const data = doc.data?.();
      const status = data?.Status?.toLowerCase?.();
      const date = data?.ReportedDate?.toDate?.();
  
      if (date && date >= cutoffDate) {
        if (status === 'reported' || status === 'assigned') {
          statusCounts.Open++;
        } else if (status === 'in progress') {
          statusCounts["In Progress"]++;
        } else if (status === 'complete') {
          statusCounts.Closed++;
        }
      }
    });
  
    return statusCounts;
  }
  