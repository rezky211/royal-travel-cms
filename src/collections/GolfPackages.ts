import type { CollectionConfig } from 'payload'

const GolfPackages: CollectionConfig = {
  slug: 'golf-packages',
  admin: {
    useAsTitle: 'package',
    description: 'Paket harga pada tiap lapangan.',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.collection === 'users',
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },
  fields: [
    {
      name: 'package',
      type: 'text',
      required: true,
      admin: { description: 'Contoh: "18 Holes – Visitor"' },
    },

    // 🔥 Tambahan baru: satuan harga
    {
      name: 'unit',
      type: 'select',
      defaultValue: 'per_person',
      options: [
        { label: 'Per person', value: 'per_person' },
        { label: 'Per hour', value: 'per_hour' },
        { label: 'Per round', value: 'per_round' },
        { label: 'Per group', value: 'per_group' },
        { label: 'Contact us / Custom', value: 'contact' },
      ],
      admin: { description: 'Satuan harga yang tampil di tabel Pricing.' },
      required: true,
    },

    // price dibuat opsional, tapi divalidasi tergantung unit
    {
      name: 'price',
      type: 'number',
      admin: {
        description: 'Wajib diisi kecuali unit = "Contact us / Custom".',
        // Opsional: hanya tampil jika bukan contact
        condition: (data) => data?.unit !== 'contact',
      },
      validate: (val: number | null | undefined, { data }: any) => {
        if (data?.unit !== 'contact' && (val === undefined || val === null)) {
          return 'Price is required for this unit.'
        }
        return true
      },
    },

    {
      name: 'currency',
      type: 'text',
      defaultValue: 'USD',
      admin: { description: 'Contoh: USD, IDR, SGD.' },
    },
    { name: 'order', type: 'number', admin: { description: 'Urutan tampil (kecil = atas).' } },

    // 🔥 Tambahan baru: catatan singkat di baris paket
    {
      name: 'notes',
      type: 'text',
      admin: { description: 'Catatan opsional, mis. “After 2 PM”, “Include cart”' },
    },

    {
      name: 'parentCourse',
      type: 'relationship',
      relationTo: 'golf-courses',
      required: true,
      admin: { description: 'Paket ini milik course mana.' },
    },
  ],
}

export default GolfPackages
