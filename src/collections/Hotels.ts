// Hotels.ts
import { CollectionConfig } from 'payload';

const Hotels: CollectionConfig = {
  slug: 'hotels',
  admin: { useAsTitle: 'name', description: 'Properti hotel atau villa utama.' },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.collection === 'users',
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'island', type: 'text', required: true },
    { name: 'type', type: 'text' },
    { name: 'starting_price', type: 'number' },
    { name: 'short_description', type: 'textarea' },

    {
      name: 'overview',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'caption', type: 'text' },
        { name: 'subtitle', type: 'text' },
        { name: 'description', type: 'richText' },
      ],
    },

    // === updated: facilities boleh upload image ===
    {
      name: 'facilities',
      type: 'array',
      fields: [
        { name: 'facility', type: 'text', required: true },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media', // collection media kamu
          required: false,
        },
      ],
    },

    {
      name: 'media',
      type: 'group',
      fields: [
        { name: 'hero', type: 'upload', relationTo: 'media', required: true },
        { name: 'overview_1', type: 'upload', relationTo: 'media' },
        { name: 'overview_2', type: 'upload', relationTo: 'media' },
        { name: 'overview_3', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
};

export default Hotels;
