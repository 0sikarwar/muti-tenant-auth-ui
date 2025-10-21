import type { Tenant } from '@/lib/types';

export const tenants: Tenant[] = [
  {
    id: 'acme',
    name: 'ACME Corporation',
    logoUrlId: 'logo-acme',
    description: 'A multinational conglomerate known for its diverse range of products.',
    theme: {
      name: 'Default',
      colors: {
        primary: '231 48% 48%', // #3F51B5
        background: '0 0% 96%', // #F5F5F5
        accent: '174 100% 29%', // #009688
      },
      fonts: {
        headline: "'Poppins', sans-serif",
        body: "'PT Sans', sans-serif",
      },
    },
  },
  {
    id: 'stark',
    name: 'Stark Industries',
    logoUrlId: 'logo-stark',
    description: 'A global leader in advanced technology and defense systems.',
    theme: {
      name: 'Stark',
      colors: {
        primary: '347 84% 43%', // #D92344
        background: '0 0% 10%', // #1A1A1A
        accent: '208 100% 50%', // #007FFF
      },
      fonts: {
        headline: "'Exo 2', sans-serif",
        body: "'Roboto', sans-serif",
      },
    },
  },
  {
    id: 'wayne',
    name: 'Wayne Enterprises',
    logoUrlId: 'logo-wayne',
    description: 'A vast, multinational corporation focused on technology, shipping, and philanthropy.',
    theme: {
      name: 'Wayne',
      colors: {
        primary: '210 14% 23%', // #333842
        background: '0 0% 98%', // #FAFAFA
        accent: '38 92% 50%', // #F7B500
      },
      fonts: {
        headline: "'Playfair Display', serif",
        body: "'Lato', sans-serif",
      },
    },
  },
];
