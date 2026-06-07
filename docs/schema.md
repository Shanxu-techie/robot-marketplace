# Database Schema

## categories

- id
- name
- slug
- description
- created_at
- updated_at

## vendors

- id
- name
- logo_url
- website
- description
- email
- phone
- created_at
- updated_at

## robots

- id
- vendor_id
- category_id
- name
- slug
- short_description
- full_description
- price_from
- price_to
- key_metric
- featured
- is_visible
- created_at
- updated_at

## robot_images

- id
- robot_id
- image_url
- alt_text
- sort_order
- created_at
- updated_at

## robot_specifications

- id
- robot_id
- label
- value
- sort_order
- created_at
- updated_at

## inquiries

- id
- robot_id (nullable)
- company_name
- contact_name
- email
- phone
- message
- status
- created_at
- updated_at

## custom_requests

- id
- company_name
- contact_name
- email
- phone
- industry
- budget
- requirements
- status
- created_at
- updated_at

## testimonials
- id
- company_name
- contact_name
- contact_title
- company_logo_url
- rating
- content
- is_visible
- sort_order
- created_at
- updated_at
<!-- add bounds to rating -->