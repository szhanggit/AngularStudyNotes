export const ORDER_CONSTANTS = {
  ORDER_STATUS_DATA: [
    { value: 0, label: 'All' },
    { value: 2, label: 'Created' },
    { value: 256, label: 'Under Review' },
    { value: 8, label: 'Approved' },
    { value: 16, label: 'Approved by FT' },
    { value: 4, label: 'Rejected' },
    { value: 32, label: 'Publishing' },
    { value: 4096, label: 'Failed' },
    { value: 128, label: 'Closed' },
    { value: 64, label: 'Published' },
  ],
  DELIVERY_STATUS_DATA: [
    { value: 'all', label: 'All' },
    { value: 'na', label: 'N/A' },
    { value: 'delivering', label: 'Delivering' },
    { value: 'delivered', label: 'Delivered' },
  ],
  PAGE_SIZES: [
    {
      value: 10,
      label: '10',
    },
    {
      value: 20,
      label: '20',
    },
    {
      value: 40,
      label: '40',
    },
  ],
  DELIVERY_TYPES: [
    {
      id: 'All',
      label: 'All',
      value: 3,
    },
    {
      id: 'SMS',
      label: 'SMS',
      value: 2,
    },
    {
      id: 'Email',
      label: 'Email',
      value: 1,
    },
  ],
  WIZARD_STEPS: {
    FOUR_STEPS: [
      'Basic Properties',
      'Product Selection',
      'Delivery Details',
      'Review & Confirm',
    ],
    THREE_STEPS: ['Basic Properties', 'Product Selection', 'Review & Confirm'],
  },
};
