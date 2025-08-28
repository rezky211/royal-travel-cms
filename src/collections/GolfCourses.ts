import type { CollectionConfig } from 'payload';
import slugify from 'slugify';

const toSlug = (s?: string) =>
  s ? slugify(s, { lower: true, strict: true, locale: 'id' }) : '';

const GolfCourses: CollectionConfig = {
  slug: 'golf-courses',
  admin: { useAsTitle: 'name', description: 'Informasi utama lapangan golf.' },
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

        if ((!data.slug || data.slug.trim() === '') && data.name) {
          const base = toSlug(data.name) || 'course';
          let candidate = base;
          let n = 2;
          const excludeId = originalDoc?.id || data.id;

          const exists = async (s: string) => {
            const res = await req.payload.find({
              collection: 'golf-courses',
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
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, admin: { position: 'sidebar' } },

    // Lokasi (samakan dengan option di <select id="location-filter">)
    {
      name: 'island',
      type: 'text',
      required: true,
      admin: {
        description:
          'Gunakan nilai: bali, ntb, ntt, kalimantan, sumatera, jawa, kepulauan riau, sulawesi, maluku, papua',
      },
    },

    // Penanda & rating
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'rating', type: 'number', min: 0, max: 5, admin: { step: 0.1 } },

    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'tagline', type: 'text' },
        { name: 'location', type: 'text' },
      ],
    },
    {
      name: 'overview',
      type: 'group',
      fields: [
        { name: 'designer', type: 'text' },
        {
          name: 'difficultyLevel',
          type: 'select',
          options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Championship', value: 'championship' },
          ],
        },
        {
          name: 'courseDetails',
          type: 'group',
          fields: [
            { name: 'holes', type: 'number' },
            { name: 'par', type: 'number' },
          ],
        },
        { name: 'copywriting', type: 'richText' },
      ],
    },
    {
      name: 'facilities',
      type: 'array',
      fields: [{ name: 'facility', type: 'text' }],
    },
    {
      name: 'details',
      type: 'group',
      fields: [
        { name: 'grassType', type: 'text' },
        { name: 'inclusions', type: 'textarea' },
      ],
    },

    // 🔥 Tambahan baru: map embed untuk iframe di detail page
    {
      name: 'map',
      type: 'group',
      admin: { description: 'Sematkan Google Maps (Embed URL).' },
      fields: [
        {
          name: 'embedUrl',
          type: 'text',
          admin: {
            description:
              'Contoh: https://www.google.com/maps/embed?... (pakai URL embed, bukan share link biasa)',
          },
        },
      ],
    },

    {
      name: 'media',
      type: 'group',
      fields: [
        { name: 'hero', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'gallery',
          type: 'array',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'caption', type: 'text' },
          ],
        },
      ],
    },
  ],
};

export default GolfCourses;
