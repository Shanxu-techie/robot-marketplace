import {
  pgTable,
  serial,
  text,
  timestamp,
  numeric,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'
import { categories, vendors } from './catalog'

export const robots = pgTable('robots', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id')
    .notNull()
    .references(() => vendors.id, { onDelete: 'restrict' }),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'restrict' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  shortDescription: text('short_description'),
  fullDescription: text('full_description'),
  priceFrom: numeric('price_from'),
  priceTo: numeric('price_to'),
  keyMetric: text('key_metric'),
  featured: boolean('featured').default(false).notNull(),
  isVisible: boolean('is_visible').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const robotImages = pgTable('robot_images', {
  id: serial('id').primaryKey(),
  robotId: integer('robot_id')
    .notNull()
    .references(() => robots.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  altText: text('alt_text'),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const robotSpecifications = pgTable('robot_specifications', {
  id: serial('id').primaryKey(),
  robotId: integer('robot_id')
    .notNull()
    .references(() => robots.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  value: text('value').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
