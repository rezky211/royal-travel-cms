import { CollectionConfig, PayloadComponent } from 'payload'
import React from 'react'

const HotelRooms: CollectionConfig = {
  slug: 'hotel-rooms',
  admin: {
    useAsTitle: 'name',
    description: 'Tipe kamar/unit di dalam sebuah hotel.',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.collection === 'users',
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },
  fields: [
    // BASIC
    { name: 'name', type: 'text', required: true },
    { name: 'price', type: 'number', required: true },

    // RELATION TO PARENT HOTEL
    {
      name: 'parentHotel',
      type: 'relationship',
      relationTo: 'hotels',
      required: true,
      hasMany: false,
    },

    // OVERVIEW
    {
      name: 'overview',
      type: 'group',
      fields: [
        { name: 'title_small', type: 'text' },
        { name: 'title_main', type: 'text' },
        { name: 'description', type: 'richText' },
      ],
    },

    // MEDIA
    {
      name: 'media',
      type: 'group',
      fields: [
        {
          name: 'hero',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'gallery',
          type: 'array',
          labels: { singular: 'Image', plural: 'Gallery' },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    },

    // HotelRooms.ts (cuplikan saja di bagian fields)
    {
      name: 'facilities',
      type: 'array',
      labels: { singular: 'Facility', plural: 'Facilities' },
      admin: {
        components: {
          RowLabel: (({ data }: { data?: any }) =>
            `${data?.name ?? 'Facility'}${data?.icon ? ` — ${data.icon}` : ''}`
          ) as any, // ← cast ke any supaya lolos perbedaan ServerProps
        },
      },
      fields: [
        { name: 'name', type: 'text', required: true },

        // ⬇️ jadikan SELECT agar tinggal pilih
        {
          name: 'icon',
          type: 'select',
          required: true,
          defaultValue: 'icon-hotel-bottle',
          admin: {
            isClearable: false, // jangan bisa kosong
          },
          options: [
            { label: 'King Size Bed', value: 'icon-hotel-double_bed_2' },
            { label: 'Safety Box', value: 'icon-hotel-safety_box' },
            { label: 'Balcony / Patio', value: 'icon-hotel-patio' },
            { label: 'TV', value: 'icon-hotel-tv' },
            { label: 'Disable Access', value: 'icon-hotel-disable' },
            { label: 'Welcome Bottle', value: 'icon-hotel-bottle' },
            { label: 'Wifi / Netflix', value: 'icon-hotel-wifi' },
            { label: 'Hair Dryer', value: 'icon-hotel-hairdryer' },
            { label: 'Air Condition', value: 'icon-hotel-condition' },
            { label: 'Laundry Service', value: 'icon-hotel-loundry' },
          ],
        },

        { name: 'note', type: 'text' }, // opsional keterangan
      ],
    },

    // OPTIONAL: REVIEWS PER ROOM
    {
      name: 'reviews',
      type: 'array',
      labels: { singular: 'Review', plural: 'Reviews' },
      fields: [
        { name: 'authorName', type: 'text', required: true },
        { name: 'rating', type: 'number', required: true, min: 0, max: 10 },
        { name: 'title', type: 'text' },
        { name: 'body', type: 'richText' },
        { name: 'publishedAt', type: 'date' },
        { name: 'avatar', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export default HotelRooms
