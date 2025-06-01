const MOCK_BUGS = [
  {
    id: 'BUG-1024',
    title: 'Dashboard charts fail to load with large datasets',
    description:
      'When loading more than 10,000 data points, the performance charts crash and display a blank screen.',
    product: 'DAPA',
    type: 'Performance',
    severity: 'High',
    status: 'Resolved',
    createdAt: '2023-11-01T10:30:00Z',
    createdBy: 'Alex Johnson',
    resolution:
      'Implemented data pagination and lazy loading to handle large datasets more efficiently.',
    comments: [
      {
        id: 1,
        user: 'Maria Garcia',
        text: 'This was affecting our enterprise customers. Thanks for the quick fix!',
        timestamp: '2023-11-02T14:20:00Z',
        likes: 5,
      },
      {
        id: 2,
        user: 'Raj Patel',
        text: 'The pagination works great now. Could we also add a warning when datasets exceed the recommended size?',
        timestamp: '2023-11-03T09:15:00Z',
        likes: 3,
      },
    ],
    suggestedResolutions: [],
  },
  // ... other bugs
];
