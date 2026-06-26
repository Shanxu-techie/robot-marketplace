import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'

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
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
