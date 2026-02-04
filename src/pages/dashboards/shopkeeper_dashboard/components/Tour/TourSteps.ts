import { Step } from 'react-joyride';

export const tourSteps: Step[] = [
  {
    target: '.dashboard-link',
    content: 'Welcome to your Dashboard! Get a quick overview of your business performance here.',
    disableBeacon: true,
  },
  {
    target: '.orders-section',
    content: 'Manage all your orders efficiently through these sections - from incoming to delivery.',
  },
  {
    target: '.finance-section',
    content: 'Track your earnings and manage payments in this section.',
  },
  {
    target: '.feedback-section',
    content: 'View customer feedback and maintain quality standards.',
  },
  {
    target: '.settings-section',
    content: 'Customize your dashboard and manage preferences here.',
  }
]; 