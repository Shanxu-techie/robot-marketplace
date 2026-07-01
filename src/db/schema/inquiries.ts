import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  pgEnum,
  uuid,
  index,
} from 'drizzle-orm/pg-core'
import { robots } from './robots'
import { users } from './users'

export const inquiryStatusEnum = pgEnum('inquiry_status', [
  'new',
  'contacted',
  'closed',
])

export const inquiries = pgTable(
  'inquiries',
  {
    id: serial('id').primaryKey(),
    robotId: integer('robot_id').references(() => robots.id, {
      onDelete: 'set null',
    }),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'restrict' })
      .notNull(),
    companyName: text('company_name').notNull(),
    contactName: text('contact_name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    message: text('message').notNull(),
    status: inquiryStatusEnum('status').default('new').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (table) => ({
    userCreatedIdx: index('user_created_idx').on(table.userId, table.createdAt),
  })
)

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
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'restrict' })
    .notNull(),
  companyName: text('company_name').notNull(),
  contactName: text('contact_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  industry: text('industry').notNull(),
  budget: text('budget').notNull(),
  requirements: text('requirements').notNull(),
  status: customRequestStatusEnum('status').default('new').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
})
