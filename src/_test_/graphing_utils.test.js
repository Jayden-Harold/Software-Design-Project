import { countReports, countStatusByCategory } from "../Admin/graphing_utils";

describe('countReports', () => {
  const recent = new Date();
  const old = new Date();
  old.setDate(old.getDate() - 10);

  const mockDocs = [
    { data: () => ({ Status: 'Reported', facility: 'Gym', ReportedDate: { toDate: () => recent } }) },
    { data: () => ({ Status: 'Complete', facility: 'Pool', ReportedDate: { toDate: () => recent } }) },
    { data: () => ({ Status: 'Assigned', facility: 'Gym', ReportedDate: { toDate: () => old } }) },
  ];

  it('Counts non-complete reports within boundary cutoff date', () => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);

    const result = countReports(mockDocs, cutoff);
    expect(result).toEqual({ Gym: 1 });
  });
  console.log("Correctly counts the non complete maintenance issues");
});

describe('countStatusByCategory', () => {
  const now = new Date();

  const mockDocs = [
    {data: () => ({Status: 'Reported', ReportedDate: {toDate: () => now } }) },
    {data: () => ({Status: 'Assigned', ReportedDate: {toDate: () => now } }) },
    {data: () => ({Status: 'In Progress', ReportedDate: {toDate: () => now } }) },
    {data: () => ({Status: 'Complete', ReportedDate: {toDate: () => now } }) },
  ];

  it('categorizes statuses correctly', () => {
    const cutoff = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); //5 days ago
    const result = countStatusByCategory(mockDocs, cutoff);

    expect(result).toEqual({
      Open: 2,
      "In Progress": 1,
      Closed: 1
    });
    console.log("Correctly counts the maintenance issues by status");
  });
});
