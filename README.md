# Muhammad Shahzad — Portfolio Website (Steps 1–4)

A responsive portfolio website built with plain HTML, CSS, and JavaScript. No build tools or package installation are required.

## Preview locally
1. Extract this ZIP file.
2. Open `index.html` in Chrome, Edge, or Firefox to view the Home Page.
3. Open `about.html` for the About page.
4. Open `services.html, contact.html` for the dedicated Services page.
5. Open `portfolio.html` for the Portfolio / Work Showcase page.
6. An internet connection is used only for Google Fonts. Layout, styling, and interactions are local files.

## Files
- `index.html` — Home Page, services overview, contact section, and portfolio teaser.
- `about.html` — About page with profile, approach, education, experience, skills, and languages.
- `services.html, contact.html` — Dedicated services page with scope, limitations, and WhatsApp contact.
- `portfolio.html` — Portfolio page with category filters and project detail lightbox.
- `styles.css` — Shared responsive theme, charcoal/orange/blue design, and animations.
- `script.js` — Mobile navigation, scroll reveal, and footer year.
- `portfolio.js` — Portfolio category filtering and accessible project detail lightbox.
- `assets/` — Reserved for authentic images and future project assets.

## Notes
- Steps 1–4 are complete. A dedicated Contact page and the Admin Panel are still planned; contact currently remains available from the Home Page and WhatsApp links.
- Portfolio cards are clearly marked as placeholders, not completed projects or client work. Replace them with real work when available.
- Skills and language levels are self-assessments and can be updated. “Travel & Office Support” is descriptive wording for prior work, not a verified official job title.
- No client counts, ratings, testimonials, awards, certificates, or brand partnerships have been invented.
- Contact email is intentionally not shown because it is still unverified. Confirm public contact details before deploying the site.
- The site is currently a static front-end. WhatsApp contact links work, but no form backend or Admin Panel exists yet.


## Contact email
The email address is included on the Contact page and in the footer links: shahzadramzanbhatti@gmail.com. Email links use `mailto:`.

## Homepage design reference
- `assets/homepage-design-reference.png` is the generated visual reference for the desired homepage look.
- This is a full-page mockup image with sample portrait and text baked into the image; it is not used as the live page background because that would duplicate the text and buttons.
- To show your real photo in the homepage hero, provide your own photo and it can be integrated as a separate image while keeping the website text and buttons functional.


## Admin Panel (Step 10)
- Open `admin.html` in the same browser as the website. The first visit asks you to set an admin password.
- You can update homepage name/headline/role/description, location, education, portrait photo, email, WhatsApp number, and accent colors.
- Settings are stored in browser `localStorage`, so they only apply in that same browser/device. Clearing browser data or using another device will not carry them over.
- This is a static-site starter admin, not a secure online CMS. Before using on a live public website, add server-side authentication and a database/backend; browser-only passwords are not production security.
- Homepage changes may require refreshing the public page.

## Expanded Admin Panel (Step 11)
Open `admin.html` in the same browser where you want to manage the site. The admin now includes editable homepage text, profile photo, theme presets, photo framing, About copy, all three Services cards, homepage portfolio sample titles/captions, social links, footer text, section visibility, and JSON settings export/import.

**Important limitation:** this project is a static website. Admin settings are stored in that browser's localStorage and do not update hosted files or sync to other devices/visitors. For shared online editing, add a server-side backend/database and proper server authentication before publishing. The local password is only a convenience gate, not production-grade security.


## Uploading your own portfolio samples
1. Open `admin.html` in the same browser where you manage the site.
2. Log in and scroll to **Upload portfolio designs**.
3. For each sample, choose an image, enter a title, select a category, and add a short caption.
4. Press **Save Changes**, then open or refresh `portfolio.html` in that same browser.
5. Uploaded designs are stored in this browser's local storage. They do not automatically sync to other devices or a hosted website. Export a settings backup regularly; it includes uploaded images.

Images are resized and compressed in the browser before saving. The panel supports up to six portfolio images in this version.


## Step 14 visual fixes
- Homepage headline keeps a two-tone treatment: first name white and last name in the orange-to-blue gradient, including when the headline is edited in Admin.
- Contact page email uses a clean envelope SVG icon and wraps long email addresses without colliding with the helper text or arrow.

## Important: use Admin Panel and photo settings correctly
For settings to sync between `admin.html` and the homepage on this computer, run `START-WEBSITE.bat` and keep its command window open. Then visit `http://127.0.0.1:4173/` and `http://127.0.0.1:4173/admin.html`. Opening HTML files directly with double-click can cause browser local-storage differences, so uploaded photos may not appear on the homepage. See `README-WHATSAPP-PHOTO-FIX.txt`.


## Final review notes (October 2026)
- The Portfolio placeholder notice can now be edited and shown/hidden from the local Admin Panel. Keep it visible until your real design samples replace placeholders.
- About headline and biography fields now apply to the About page as well as the homepage biography area.
- This remains a static site. Admin settings, password, profile photo, and uploaded sample images are stored in the current browser's localStorage, not synced to other visitors or devices. GitHub Pages cannot provide a secure server-side admin by itself. Do not use the local Admin Panel as production-grade security.
- For a live public portfolio with changes synchronized for every visitor, connect a backend/database and server-side authentication, or publish changes by updating the site files and redeploying.
- Before sharing for jobs, replace all six placeholder cards with genuine work samples or leave the notice visible. Verify dates, education, skills, contact details, and links against your own records.


## Job-only profile and Admin Panel controls
The Admin Panel now includes editable fields for the profile availability line, Contact page introduction/note, and first contact topic title/description. The default copy is job-focused and does not advertise internships. Changes are stored in localStorage for the same browser/device only. GitHub Pages does not provide a database or server-side admin; settings changed in the Admin Panel will not automatically sync to all public visitors. Do not treat this local admin login as production security.


## Supabase online integration (October 2026)

This ZIP includes a Supabase client configuration for project `https://svmsdqgvfwtwhajjvcas.supabase.co` using the publishable key. The publishable key is designed for browser use; never place a service-role/secret key in this website.

### Before deploying
1. In Supabase, confirm the `site_settings` table has row `id = 1` and the `portfolio_admins` table contains the Auth user for `muhammadshahzad23092004@gmail.com`.
2. Confirm the `portfolio-images` storage bucket exists and the Row Level Security policies from the SQL setup are enabled.
3. Extract the ZIP and run `START-WEBSITE.bat` for local preview; leave its command window open. Open `http://127.0.0.1:4173/` and `http://127.0.0.1:4173/admin.html`. Internet is needed for Supabase.
4. Sign in with the Supabase Auth email and password you created. Do not use the public contact email unless it is also your Auth account.
5. Save a small test change, refresh the public page, and verify it appears. Test image upload before uploading many images.
6. Deploy the extracted website folder contents to GitHub Pages. The public pages read the shared `site_settings` row; Admin changes are saved online.

### Important notes
- Online Admin authentication is through Supabase Auth, not the old local browser password.
- Shared site text and the profile photo / six sample images are saved in `site_settings`; images are uploaded to the public `portfolio-images` bucket.
- The Portfolio page can read public visible rows from `portfolio_items`, but this version's Admin form currently manages the six samples through the `site_settings` JSON settings field. To manage a separate, unlimited `portfolio_items` gallery, a dedicated database CRUD editor is still needed.
- Do not disable RLS or expose a service-role key. If a save fails, check the exact Supabase error shown in the Admin panel and review table/storage policies.
- Verify the website after deployment. This package was code-patched for Supabase integration; it has not been verified against your live Supabase project from this environment.
