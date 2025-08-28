import type { CollectionConfig } from 'payload';
import slugify from 'slugify';

const toSlug = (s?: string) =>
  s ? slugify(s, { lower: true, strict: true, locale: 'id' }) : '';

const Yachts: CollectionConfig = {
  slug: 'yachts',
  admin: { useAsTitle: 'name' },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.collection === 'users',
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },

  hooks: {
    beforeValidate: [
      async ({ data, req, originalDoc }) => {
        if (!data) return data;

        // Auto slug (unik)
        if ((!data.slug || data.slug.trim() === '') && data.name) {
          const base = toSlug(data.name) || 'yacht';
          let candidate = base;
          let n = 2;
          const excludeId = originalDoc?.id || data.id;

          const exists = async (s: string) => {
            const res = await req.payload.find({
              collection: 'yachts',
              where: {
                and: [
                  { slug: { equals: s } },
                  ...(excludeId ? [{ id: { not_equals: excludeId } }] : []),
                ],
              },
              limit: 1,
              depth: 0,
            });
            return (res?.totalDocs || 0) > 0;
          };

          while (await exists(candidate)) candidate = `${base}-${n++}`;
          data.slug = candidate;
        }

        return data;
      },
    ],
  },

  fields: [
    // ===== Hero / Basic =====
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, admin: { position: 'sidebar' } },
    { name: 'tagline', type: 'text', admin: { description: 'Teks kecil di hero.' } },

    // ===== Meta & Overview =====
    { name: 'type', type: 'text', admin: { description: 'Luxury Motor Yacht, Catamaran, dll.' } },
    { name: 'island', type: 'text', admin: { description: 'Bali, Lombok, Raja Ampat, dll.' } },
    { name: 'short_description', type: 'textarea' },
    { name: 'overview', type: 'richText' },

    // ===== Pricing “starting from” (untuk listing) =====
    { name: 'starting_price', type: 'number' },
    { name: 'currency', type: 'text', defaultValue: 'USD' },

    // ===== Key Details =====
    { name: 'lengthMeters', type: 'number', admin: { description: 'Panjang kapal (meter).' } },
    {
      name: 'sizeClass',
      type: 'select',
      options: [
        { label: 'Small (≤20m)', value: 'small' },
        { label: 'Medium (20–35m)', value: 'medium' },
        { label: 'Large (35m+)', value: 'large' },
      ],
      admin: { description: 'Klasifikasi ukuran untuk filter.' },
    },
    {
      name: 'sizeLabel',
      type: 'text',
      admin: { description: 'Opsional, mis. “Superyacht”. Ditampilkan bersama length.' },
    },
    { name: 'capacity', type: 'number', admin: { description: 'Jumlah tamu maksimum.' } },
    { name: 'cabins', type: 'number', admin: { description: 'Jumlah kabin.' } },
    { name: 'crew', type: 'text', admin: { description: 'Contoh: Captain, Chef, 3 Hosts.' } },
    {
      name: 'features',
      type: 'array',
      labels: { singular: 'Feature', plural: 'Features' },
      fields: [{ name: 'item', type: 'text' }],
    },
    {
      name: 'experiences',
      type: 'select',
      hasMany: true,
      options: ['romance', 'adventure', 'family', 'leisure'],
    },

    // ===== Media =====
    {
      name: 'media',
      type: 'group',
      fields: [
        { name: 'hero', type: 'upload', relationTo: 'media' },
        {
          name: 'gallery',
          type: 'array',
          labels: { singular: 'Image', plural: 'Gallery' },
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'caption', type: 'text' },
          ],
        },
      ],
    },

    // ===== Schedule (Upcoming Availability table) =====
    {
      name: 'schedules',
      type: 'array',
      admin: {
        description:
          'Mengisi tabel “Upcoming Availability”. Frontend akan filter berdasarkan bulan yang dipilih.',
      },
      fields: [
        { name: 'startDate', type: 'date', required: true },
        { name: 'endDate', type: 'date', required: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'available',
          options: [
            { label: 'Available', value: 'available' },
            { label: 'Reserved', value: 'reserved' },
            { label: 'Maintenance', value: 'maintenance' },
          ],
        },
        { name: 'route', type: 'text', required: true, admin: { placeholder: 'Bali → Lombok → Komodo → Bali' } },
      ],
    },

    // ===== Special Voyages (cards) =====
    {
      name: 'specialVoyages',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'startDate', type: 'date', required: true },
        { name: 'endDate', type: 'date', required: true },
        { name: 'route', type: 'text' },
        { name: 'spots', type: 'number', admin: { description: 'Sisa kuota/kapasitas.' } },
        { name: 'badge', type: 'text', admin: { description: 'Mis. “Limited Spots”, “Couples Only”.' } },
        { name: 'description', type: 'textarea' },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    // ===== Private Events (cards) =====
    {
      name: 'privateEvents',
      type: 'array',
      labels: { singular: 'Event', plural: 'Private Events' },
      fields: [
        { name: 'title', type: 'text', required: true },          // e.g., Weddings & Anniversaries
        { name: 'icon', type: 'text', admin: { description: 'Nama ikon (mis. heart, briefcase) untuk frontend.' } },
        { name: 'description', type: 'textarea' },
        {
          name: 'features',
          type: 'array',
          fields: [{ name: 'item', type: 'text' }],
        },
      ],
    },
  ],
};

export default Yachts;
