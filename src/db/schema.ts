import {
  pgTable,
  serial,
  text,
  timestamp,
  numeric,
  boolean,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core'

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const vendors = pgTable('vendors', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  logoUrl: text('logo_url'),
  website: text('website').notNull().unique(),
  description: text('description'),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

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
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const robotImages = pgTable('robot_images', {
  id: serial('id').primaryKey(),
  robotId: integer('robot_id')
    .notNull()
    .references(() => robots.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  altText: text('alt_text'),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const robotSpecifications = pgTable('robot_specifications', {
  id: serial('id').primaryKey(),
  robotId: integer('robot_id')
    .notNull()
    .references(() => robots.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  value: text('value').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const inquiryStatusEnum = pgEnum('inquiry_status', [
  'new',
  'contacted',
  'closed',
])

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  robotId: integer('robot_id').references(() => robots.id, {
    onDelete: 'set null',
  }),
  companyName: text('company_name').notNull(),
  contactName: text('contact_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message').notNull(),
  status: inquiryStatusEnum('status').default('new').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const customRequestStatusEnum = pgEnum('custom_request_status', [
  'new',
  'contacted',
  'reviewing',
  'proposal_sent',
  'approved',
  'rejected',
  'closed',
])

export const customRequests = pgTable('custom_requests', {
  id: serial('id').primaryKey(),
  companyName: text('company_name').notNull(),
  contactName: text('contact_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  industry: text('industry').notNull(),
  budget: text('budget').notNull(),
  requirements: text('requirements').notNull(),
  status: customRequestStatusEnum('status').default('new').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  companyName: text('company_name').notNull(),
  contactName: text('contact_name').notNull(),
  contactTitle: text('contact_title').notNull(),
  companyLogoUrl: text('company_logo_url'),
  rating: integer('rating'),
  content: text('content').notNull(),
  isVisible: boolean('is_visible').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
