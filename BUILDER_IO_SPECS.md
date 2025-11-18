# Builder.io Design Specifications for Paradisul DJilor

## Project Overview
**Platform Name:** Paradisul DJilor  
**Target Audience:** Romanian DJs exclusively  
**Language:** Romanian (RO)  
**Purpose:** Landing page for a platform connecting Romanian DJs with clients

## Design Requirements

### 1. Landing Page Sections

Design a modern, professional landing page with the following sections:

#### Header/Navigation
- Logo/Brand name: "Paradisul DJilor"
- Navigation menu items:
  - Despre (About)
  - Prețuri (Pricing)
  - Contact
- Action buttons:
  - "Autentificare" (Login) button
  - "Înregistrare" (Register) button (primary CTA)

#### Hero Section
- Main headline: Compelling value proposition for Romanian DJs, this app will facilitate comunication between the DJ and the dj's clients.
- Subheadline: Brief description of the platform
- Primary CTA: "Începe acum" (Start Now) or "Creează cont" (Create Account)
- Secondary CTA: "Află mai multe" (Learn More)
- Background: Wedding & fancy events with Music/DJ themed imagery or gradient, will be imported from other sites that will be used as inspiration inside fusion.

#### Features/Benefits Section
- Showcase 3-4 key features:
  - Gestionare profil profesional (Professional Profile Management)
  - Tabel cu clienti (Clients Dashboard)
  - Abonament lunar (Monthly Subscription)
  - Suport pentru plăți Stripe (Stripe Payment Support)
- Use icons or illustrations for each feature

#### Pricing/Subscription Section
- Display subscription
- There is only a Monthly subscription option
- Mention Stripe payment integration
- Currency: Romanian Leu (RON)
- Clear pricing display

#### Call-to-Action Section
- Strong CTA for registration
- "Alătură-te acum" (Join Now) or similar
- Brief benefits reminder: this app will facilitate comunication between the DJ and the dj's clients.

#### Footer
- Links to:
  - Terms of Service
  - Privacy Policy
  - Contact
  - Social media links (if applicable)
- Language: Romanian, English

### 2. Design Style Guidelines

#### Color Palette
- will be imported by the fusion feature from another website provided by the user.

#### Typography
- Will be imported by the fusion feature from another website provided by the user.
- Support Romanian characters (ă, â, î, ș, ț)
- Clear hierarchy (headings, body text, CTAs)

#### Imagery
- Placeholder support for:
  - DJ photos
  - Event/party images
  - Music equipment
- Ensure images are culturally appropriate for Romanian market

#### Buttons
- Primary buttons: Clear, prominent CTAs
- Secondary buttons: Less prominent but visible
- Hover states: Interactive feedback
- Text: Romanian language, English language, (Multilanguage support.)

### 3. Responsive Design Requirements

- **Mobile:** Optimized for phones (320px - 768px)
- **Tablet:** Optimized for tablets (768px - 1024px)
- **Desktop:** Full experience (1024px+)
- Ensure all sections stack properly on mobile
- Navigation should be mobile-friendly (hamburger menu)

### 4. Components to Design

Create reusable components for:

1. **Header Component**
   - Logo
   - Navigation menu
   - Login/Register buttons

2. **Hero Component**
   - Headline
   - Subheadline
   - CTA buttons
   - Background image/gradient

3. **Feature Card Component**
   - Icon/illustration
   - Title
   - Description

4. **Pricing Card Component**
   - Plan name
   - Price (RON)
   - Features list
   - CTA button

5. **Footer Component**
   - Links
   - Social icons
   - Copyright

### 5. Future-Ready Considerations

Design with these future features in mind (but don't implement yet):

- **Login Form Component**
  - Email input
  - Password input
  - "Remember me" checkbox
  - "Forgot password" link
  - Submit button

- **Registration Form Component**
  - Name fields
  - Email input
  - Password input
  - Terms acceptance checkbox
  - Submit button

- **Subscription/Payment Flow Components**
  - Plan selection
  - Payment form (Stripe-ready)
  - Success/error states

### 6. Technical Notes for Implementation

- Design will be manually implemented in Angular components
- Use SCSS for styling
- Components should be modular and reusable
- Follow Angular best practices for component structure
- Ensure designs are exportable as assets (images, icons, etc.)

### 7. Content Guidelines

- All text should be in Romanian
- Use professional but approachable tone
- Highlight benefits for DJs
- Emphasize ease of use and professional tools
- Mention Stripe payment security

### 8. Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader friendly
- Color contrast ratios meet standards
- Alt text for images

---

## Deliverables Expected from Builder.io

1. Complete landing page design
2. Component designs (header, hero, features, pricing, footer)
3. Responsive breakpoints defined
4. Color palette and typography specifications
5. Asset exports (icons, images if applicable)
6. Design system/style guide

## Next Steps After Design Completion

1. Export designs from Builder.io
2. Implement designs manually in Angular components
3. Create corresponding Angular components for each section
4. Apply styles using SCSS
5. Test responsive behavior
6. Integrate with Angular routing

