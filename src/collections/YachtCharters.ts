import type { CollectionConfig } from 'payload';
import slugify from 'slugify';

const toSlug = (s?: string) =>
  s ? slugify(s, { lower: true, strict: true, locale: 'id' }) : '';

const YachtCharters: CollectionConfig = {
  slug: 'yacht-charters',
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

        if ((!data.slug || data.slug.trim() === '') && data.name) {
          const base = toSlug(data.name) || 'charter';
          let candidate = base;
          let n = 2;
          const excludeId = originalDoc?.id || data.id;

          const exists = async (s: string) => {
            const res = await req.payload.find({
              collection: 'yacht-charters',
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

    { name: 'parentYacht', type: 'relationship', relationTo: 'yachts', required: true, admin: { description: 'Paket ini milik yacht apa.' } },
    { name: 'order', type: 'number', admin: { description: 'Urutan tampil di tabel harga (kecil = lebih atas).' } },

    { name: 'price', type: 'number', required: true },
    { name: 'currency', type: 'text', defaultValue: 'USD' },

    { name: 'durationDays', type: 'number' },
    { name: 'durationHours', type: 'number' },

    {
      name: 'inclusions',
      type: 'array',
      fields: [{ name: 'item', type: 'text' }],
    },

    // opsional gambar per paket
    {
      name: 'media',
      type: 'group',
      fields: [
        {
          name: 'gallery',
          type: 'array',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'caption', type: 'text' },
          ],
        },
      ],
    },
  ],
};

export default YachtCharters;
