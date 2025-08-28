import type { CollectionConfig } from 'payload'
import slugify from 'slugify'

const toSlug = (s?: string) => (s ? slugify(s, { lower: true, strict: true, locale: 'id' }) : '')

const JetCharters: CollectionConfig = {
  slug: 'jet-charters',
  admin: {
    useAsTitle: 'name',
    description: 'Paket charter/rute spesifik untuk jet.',
    defaultColumns: ['name', 'price', 'currency', 'tripType', 'parentJet', 'slug'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.collection === 'users',
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },

  fields: [
    // Identitas
    { name: 'name', type: 'text', required: true }, // mis. "One-way: Singapore (XSP) → Bali (DPS)"
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Auto dari Name; bisa disunting.' },
    },

    // Relasi ke jet induk (untuk ambil capacity, specs, dll.)
    {
      name: 'parentJet',
      label: 'Jet',
      type: 'relationship',
      relationTo: 'private-jets',
      required: true,
      hasMany: false,
    },

    // Harga
    { name: 'price', label: 'Charter Price', type: 'number', required: true, min: 0, admin: { step: 100 } },
    {
      name: 'currency',
      type: 'select',
      defaultValue: 'USD',
      options: [
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'IDR', value: 'IDR' },
      ],
    },
    {
      name: 'tripType',
      label: 'Trip Type',
      type: 'select',
      defaultValue: 'oneway',
      options: [
        { label: 'One-way', value: 'oneway' },
        { label: 'Round-trip', value: 'roundtrip' },
      ],
    },

    // Rute (untuk card "Your Journey Details")
    {
      name: 'route',
      type: 'group',
      fields: [
        { name: 'fromCity', label: 'From City', type: 'text', required: true },
        { name: 'fromAirport', label: 'From Airport', type: 'text' },
        { name: 'fromCode', label: 'From IATA/ICAO Code', type: 'text' },
        { name: 'toCity', label: 'To City', type: 'text', required: true },
        { name: 'toAirport', label: 'To Airport', type: 'text' },
        { name: 'toCode', label: 'To IATA/ICAO Code', type: 'text' },
        {
          name: 'durationMinutes',
          label: 'Duration (minutes)',
          type: 'number',
          min: 0,
          admin: { description: 'Mis. 150 untuk 2h 30m.' },
        },
      ],
    },

    // Inclusions (list di panel kanan)
    {
      name: 'inclusions',
      label: 'Package Includes',
      type: 'array',
      labels: { singular: 'Inclusion', plural: 'Inclusions' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },

    // Copy / deskripsi
    {
      name: 'overview',
      type: 'group',
      fields: [
        { name: 'title_small', type: 'text' },
        { name: 'title_main', type: 'text' },
        { name: 'description', type: 'richText' },
      ],
    },

    // Media
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
  ],

  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (!data) return
        if (!data.slug && data.name) data.slug = toSlug(data.name)
        if (data.slug) data.slug = toSlug(data.slug)
      },
    ],
  },
}

export default JetCharters
