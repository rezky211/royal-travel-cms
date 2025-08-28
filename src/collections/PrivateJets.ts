import type { CollectionConfig } from 'payload'
import slugify from 'slugify'

const toSlug = (s?: string) => (s ? slugify(s, { lower: true, strict: true, locale: 'id' }) : '')

const PrivateJets: CollectionConfig = {
  slug: 'private-jets',
  admin: {
    useAsTitle: 'name',
    description: 'Informasi armada jet pribadi.',
    defaultColumns: ['name', 'type', 'capacity', 'homeBase', 'startingPrice', 'slug'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.collection === 'users',
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },

  fields: [
    // Identitas
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Auto dari Name; bisa disunting.' },
    },

    // Klasifikasi & operasional
    {
      name: 'type',
      label: 'Aircraft Type',
      type: 'select',
      required: true,
      defaultValue: 'midsize',
      options: [
        { label: 'Light Jet', value: 'light' },
        { label: 'Midsize Jet', value: 'midsize' },
        { label: 'Heavy Jet', value: 'heavy' },
        { label: 'Ultra Long Range', value: 'ultra' },
      ],
      admin: { description: 'Dipakai untuk filter di website.' },
    },
    { name: 'manufacturer', type: 'text' },
    { name: 'model', type: 'text' },
    {
      name: 'homeBase',
      label: 'Home Base',
      type: 'text',
      admin: { description: 'Lokasi/bandara utama jet.' },
    },
    {
      name: 'capacity',
      label: 'Passenger Capacity',
      type: 'number',
      required: true,
      min: 1,
      admin: { description: 'Maksimum penumpang (mis. 14).' },
    },
    { name: 'rangeKm', label: 'Range (km)', type: 'number', min: 0 },
    { name: 'rangeNm', label: 'Range (NM)', type: 'number', min: 0 },
    { name: 'cruiseSpeedKts', label: 'Cruising Speed (kts)', type: 'number', min: 0 },
    { name: 'cruiseAltitudeFt', label: 'Cruising Altitude (ft)', type: 'number', min: 0 },

    // Konten untuk spesifikasi & pengalaman
    {
      name: 'cabinFeatures',
      label: 'Cabin Features',
      type: 'array',
      labels: { singular: 'Feature', plural: 'Features' },
      fields: [{ name: 'feature', type: 'text', required: true }],
    },
    {
      name: 'crew',
      label: 'Crew',
      type: 'array',
      labels: { singular: 'Crew Role', plural: 'Crew Roles' },
      fields: [{ name: 'role', type: 'text', required: true }],
    },
    {
      name: 'inflightExperience',
      label: 'In-Flight Experience',
      type: 'array',
      labels: { singular: 'Experience', plural: 'Experiences' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },

    // Harga
    {
      name: 'startingPrice',
      label: 'Harga Mulai (per jam, USD)',
      type: 'number',
      min: 0,
      admin: { step: 100 },
    },

    // Deskripsi / overview
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

    // Media
    {
      name: 'media',
      type: 'group',
      fields: [
        { name: 'hero', type: 'upload', relationTo: 'media', required: true },
        { name: 'overview_1', type: 'upload', relationTo: 'media' },
        { name: 'overview_2', type: 'upload', relationTo: 'media' },
        { name: 'overview_3', type: 'upload', relationTo: 'media' },
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

export default PrivateJets
