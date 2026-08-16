# Dankamf Educational Complex
## Enterprise Public Website & Administration Platform User Manual

**Version:** 1.0  
**Platform:** Dankamf Educational Complex  
**Live website:** https://dankamf-eduplex.web.app  
**Audience:** School leadership, admissions officers, content managers, administrators and support staff

---

## 1. Purpose of this manual

This manual explains how to use the Dankamf public website and its protected administration platform. It covers:

- How visitors navigate the website and submit enquiries.
- How authorised staff review admissions, applications and messages.
- How superadmins manage school content, users, images and settings.
- How to format Markdown content professionally.
- How to troubleshoot common access, upload and display issues.

This is an operating guide. Technical deployment instructions remain in the repository [README.md](../README.md).

## 2. Platform overview

The platform has two connected areas:

### Public website

The public area presents the school to prospective families, current families, learners, alumni and the wider community. Content is displayed from Firebase where the relevant section is dynamic.

### Administration platform

The admin area provides secure tools for managing school content and operational submissions. Access requires Firebase Authentication and a matching profile in the Firestore `users` collection.

The canonical roles are:

- `superadmin` — full content, user, upload, settings and security-management authority.
- `admin` — operational viewing and approved response/status workflows. Content publishing and file-management writes are restricted by the deployed rules.

## 3. Public website guide

### Main public navigation

| Area | URL | Purpose |
|---|---|---|
| Home | `/` | Hero carousel, school introduction, highlights, academics, news, events, testimonials, gallery and calls to action. |
| About | `/about` | History, leadership, vision, mission, values, achievements and educational philosophy. |
| Academics | `/academics` and `/services` | Academic programmes and curriculum information. |
| Programme details | `/academics/:slug` | Full programme description, image, curriculum, assessment and timetable information. |
| School capabilities | `/school-capabilities` | Why families choose Dankamf and the school’s capabilities. |
| Student Life | `/student-life` | Clubs, sports, STEM, arts, leadership and activities. |
| Campus Gallery | `/gallery` | Published campus images and visual content. |
| Staff Directory | `/staff` | Staff and leadership profiles. |
| News & Events | `/blog`, `/calendar` | News, announcements, articles and event information. |
| Admissions | `/admissions`, `/admissions/apply` | Admissions information and online application. |
| Fees | `/admissions/fees` | Published fee information. |
| Interview booking | `/admissions/interview` | Request an admissions interview. |
| Application status | `/admissions/status` | Check an admission application status where configured. |
| Jobs | `/jobs`, `/jobs/:id` | Vacancies and job application details. |
| Alumni | `/alumni` | Alumni registration and community information. |
| Downloads | `/downloads` | Prospectuses, forms, policies, calendars and other published resources. |
| Search | `/search` | Search available public pages and dynamic content. |
| Contact | `/contact` | Contact form, phone, email, WhatsApp, office information and directions. |
| FAQs | `/faqs` | Frequently asked questions and answers. |
| Client confidence | `/client-confidence` | Parent, student and community testimonials. |

### Visitor actions

Visitors can:

1. Use the header navigation or search to find information.
2. Open cards to view previews and full details.
3. Submit contact, admission, tour, interview, alumni or newsletter forms.
4. Download published school documents.
5. Tap phone numbers on compatible mobile devices to open the dialler.
6. Use WhatsApp or the Let's Chat control where available.
7. Browse the site on mobile portrait, mobile landscape, tablet, laptop and desktop layouts.

### Admissions workflow for visitors

1. Open **Admissions** or select **Enroll Online**.
2. Complete the learner and parent/guardian information.
3. Review the information before submission.
4. Submit the application.
5. Save the application reference if one is generated.
6. Use **Application Status** or contact the school for follow-up.

### Job application workflow for visitors

1. Open **Jobs & Vacancies**.
2. Select a vacancy and read the full description and requirements.
3. Complete the application form.
4. Attach a PDF résumé where requested.
5. Submit the application and wait for the school’s response.

## 4. Signing in to the admin panel

1. Open `https://dankamf-eduplex.web.app/login`.
2. Enter the registered Firebase Authentication email and password.
3. Select **Sign In**.
4. After successful authentication, open the dashboard.

The user must have both:

- A Firebase Authentication account.
- A Firestore document at `users/{authentication-uid}` containing the correct email and role.

The UID in Authentication and the document ID in Firestore must match. A similar-looking email is not enough if the profile is attached to another UID.

### Login failure guidance

| Message | Meaning | Action |
|---|---|---|
| Invalid credential | Email or password is incorrect, or the account does not exist. | Confirm the exact registered email and reset/re-register only when necessary. |
| Access denied | The account is authenticated but lacks an approved role. | Ask a superadmin to confirm the `users/{uid}` profile. |
| Missing permissions | The account reached Firebase but attempted a restricted operation. | Confirm the role and use a superadmin account for publishing or uploads. |
| Blank/404 page | A direct route or stale deployment may be in use. | Refresh, open the main site first, then retry; confirm the route exists. |

## 5. Admin dashboard

The dashboard provides an operational summary and links to management areas. Use the sidebar on desktop or the menu control on smaller screens. The active page is highlighted.

### Admin route directory

| Admin area | URL | Typical responsibility |
|---|---|---|
| Dashboard | `/dashboard` | Summary cards, activity and visitor overview. |
| Academic programmes | `/admin/manage-services` | View academic programmes; add/edit route is `/admin/services`. |
| Projects / school life | `/admin/manage-projects` | Manage project and student-life content. |
| Services | `/admin/manage-services` | Manage school-related service/programme records. |
| Enterprise features | `/admin/enterprise-features` | Manage homepage “The Dankamf Advantage” cards. |
| News/posts | `/admin/manage-posts`, `/admin/blog` | Create and manage news or article content. |
| Events | `/admin/manage-events` | Review, edit and remove event records. |
| FAQs | `/admin/manage-faqs` | Maintain FAQ questions, answers and display order. |
| Testimonials | `/admin/client-testimonials` | Manage Client Confidence testimonials. |
| Hero images | `/admin/hero-images` | Superadmin-only hero image publishing and ordering. |
| Gallery | `/admin/gallery` | Upload gallery images or reuse published hero images. |
| About profile | `/admin/about` | School introduction, history, leadership message, vision, mission, values and achievements. |
| Leadership | `/admin/leadership` | Staff and leadership names, roles, biographies, photos and order. |
| Downloads | `/admin/downloads` | Publish school documents and resources. |
| School alerts | `/admin/alerts` | Publish and manage notices shown to visitors. |
| Admissions | `/admin/admissions` | Review applications, update status and manage documents. |
| Fees and scholarships | `/admin/fees` | Maintain published fee and scholarship information. |
| Interviews | `/admin/interviews` | Review and update interview request status. |
| Alumni | `/admin/alumni` | Review alumni registrations. |
| Jobs | `/admin/jobs` | Create and manage vacancies. |
| Job applications | `/admin/applications/:jobId` | Review applicant details, documents and replies. |
| Contact forms | `/admin/forms` | Read enquiries and send replies. |
| Users | `/admin/users`, `/admin/add-user` | Superadmin-only user and role management. |
| Settings | `/admin/settings` | School-wide configuration and public contact settings. |
| Activity logs | `/admin/activity-logs` | Review recorded administrative actions. |
| Profile | `/admin/profile` | Review the signed-in administrator profile. |

## 6. Role and permission matrix

| Capability | Superadmin | General admin |
|---|---:|---:|
| View dashboard and content | Yes | Yes |
| View contact forms and applications | Yes | Yes |
| Reply to contact/job enquiries | Yes | Yes |
| Update approved application/interview statuses | Yes | Yes |
| Create or edit public content | Yes | No |
| Delete public content | Yes | No |
| Upload or remove hero/gallery/content files | Yes | No |
| Manage academic programmes | Yes | No |
| Manage users and roles | Yes | No |
| Change global settings | Yes | No |
| Read activity logs | Yes | Yes |

The deployed Firestore and Storage rules are the final authority. Hiding a button in the interface is not a security boundary; Firebase rules enforce the restriction.

## 7. Managing dynamic content

### General publishing process

For a superadmin:

1. Open the relevant management page.
2. Review existing records before adding a duplicate.
3. Select **Add**, **Edit** or the relevant action.
4. Enter concise, accurate content.
5. Set the display order where available. Lower numbers appear first.
6. Upload an appropriately sized image if required.
7. Save or publish.
8. Open the public page in a new tab and verify the result on desktop and mobile.

### Display order

Use numeric ordering to control homepage and listing sequence. Recommended values are `1`, `2`, `3`, and so on. Avoid duplicate numbers when a clear sequence matters.

Ordering applies particularly to:

- Academic programmes.
- Hero images.
- Gallery images.
- FAQs.
- Testimonials.
- Leadership profiles.
- School capabilities.
- News and events where supported.

### Homepage previews

Dynamic homepage sections should show a short preview, not the full record. The visitor selects **Read More**, **View programme**, **Explore**, or the relevant card to open the complete page or detail view.

When preparing content for a homepage card:

- Begin with a clear title or opening sentence.
- Put the most important benefit in the first two or three sentences.
- Keep long curriculum, policy or achievement details on the full page.
- Confirm the detail link opens the correct record.

## 8. Markdown content standard

Markdown is supported in descriptions, biographies, programme content, news, FAQs and other rich-text fields.

### Recommended syntax

```markdown
## Programme Overview

The **Crèche and Nursery programme** supports safe, caring and stimulating early learning.

### Learning Areas

- Early language and communication
- Number awareness and basic mathematics
- Creative arts, music and movement

Read more about the [admissions process](/admissions).
```

### Content rules

- Use one `##` heading for a major subsection.
- Use `###` for a subsection under it.
- Use short paragraphs of two to four sentences.
- Use bullet lists for subjects, requirements and features.
- Use bold only for important terms.
- Do not paste raw HTML unless specifically supported by the field.
- Do not place confidential information, passwords or private student records in public content.
- Preview the result after saving; malformed Markdown can affect readability.

## 9. Image and file standards

### Hero images

- Recommended format: WebP or optimized JPG.
- Maximum target size: approximately 200–300 KB.
- Use a wide composition suitable for desktop and mobile crops.
- Keep important faces, logos and text away from extreme edges.
- Use the numeric order field to control the carousel.

### Gallery images

- Recommended format: WebP.
- Target size: approximately 120–180 KB.
- Use descriptive titles and categories.
- Reuse an existing hero image through the gallery selector when appropriate instead of uploading a duplicate.

### Documents

- Use clear filenames without sensitive personal information.
- Upload only approved school documents.
- Confirm the public download link after publishing.

### Image quality checklist

Before upload, confirm:

1. The image is sharp and correctly oriented.
2. The file is within the size limit.
3. The image does not contain private information.
4. The composition works in a responsive container.
5. The image is not already published elsewhere unless reuse is intentional.

## 10. Common operational workflows

### Publish a news article

1. Open `/admin/blog` or the news management route.
2. Add a clear title.
3. Write the article in Markdown.
4. Add an optimized image if required.
5. Publish and confirm the homepage preview.
6. Open the full article and verify Markdown headings, lists and links.

### Publish an academic programme

1. Open `/admin/manage-services` or `/admin/services`.
2. Add the programme title and display order.
3. Enter a concise description for previews.
4. Add curriculum, assessment and timetable content in Markdown.
5. Upload the programme image.
6. Save and open `/academics/{programme-slug}`.

### Update About Us

1. Open `/admin/about`.
2. Update only the relevant section: introduction, history, vision, mission, values, achievements, philosophy or leadership message.
3. Use Markdown headings and lists for long sections.
4. Add or replace proprietor/headteacher images when authorised.
5. Save and verify `/about` on a large and small screen.

### Add a staff or leadership profile

1. Open `/admin/leadership`.
2. Enter the person’s name, role, display order and biography.
3. Upload a clear professional image.
4. Keep the biography factual and suitable for public publication.
5. Verify the About preview and the full `/staff` profile.

### Review a contact message

1. Open `/admin/forms`.
2. Read the enquiry and confirm the sender’s email.
3. Select **Reply**.
4. Write a professional response.
5. Send/save the reply.

### Review an admission application

1. Open `/admin/admissions`.
2. Review the learner, guardian, programme and contact information.
3. Update the status only when the school has completed the relevant step.
4. Open **Manage files** when authorised documents must be reviewed.
5. Keep personal data confidential.

### Review a job application

1. Open `/admin/jobs` and select the vacancy applications.
2. Select **View Details**.
3. Review applicant details, cover message and CV/PDF.
4. Use the reply workflow for approved communication.
5. Do not download or share applicant information outside authorised school processes.

## 11. Security and data protection

- Never share administrator passwords.
- Use individual Firebase accounts rather than shared credentials.
- Sign out after using a shared computer.
- Use `superadmin` only for tasks that require elevated authority.
- Do not upload identity documents to public content folders.
- Do not place API secrets, service-account keys or private tokens in the frontend repository.
- Review access whenever a staff member leaves or changes responsibility.
- Treat admissions, job applications, contact messages and alumni records as confidential.
- Report unexpected permission errors rather than weakening Firebase rules.

## 12. Troubleshooting

### A page is blank

Refresh the page, return to the homepage and navigate again. If the issue affects one content card, check that its Firestore record contains the expected title and content fields.

### A route shows 404

Open the main domain first, then navigate through the application. Firebase Hosting is configured for single-page application rewrites; a stale browser cache can also show an old route.

### An image does not display

Check that the record contains a valid `imageUrl` or `iconUrl`, that the file upload completed, and that the user has the required role. Confirm the Storage path matches the feature’s approved folder.

### “Missing or insufficient permissions”

This normally means a general admin attempted a superadmin-only write, or the Authentication UID does not have a matching Firestore user profile. Confirm the user document and use the correct role.

### Markdown appears as plain text

Check that the content is entered in a Markdown-enabled field and that headings use `##` or `###` followed by a space. Save, refresh and inspect the full detail page.

### A homepage card shows too much text

The source content is probably missing a preview boundary or is being rendered by an outdated build. Confirm the public preview component, rebuild and deploy only after verification.

### Mobile layout is difficult to use

Test both portrait and landscape orientations. Confirm that the browser is not zoomed, the menu can scroll, and the latest deployed build is loaded after a hard refresh.

## 13. Local testing and release checklist

Before a release:

1. Run the local app with `npm start`.
2. Test homepage, About, Academics, Admissions, Jobs, Contact and admin login.
3. Test mobile portrait, mobile landscape, tablet, laptop and desktop.
4. Test at least one form submission and one admin response workflow.
5. Confirm images and Markdown render correctly.
6. Run the production build:

```powershell
$env:GENERATE_SOURCEMAP='false'; npm run build
```

7. Review `git status` and confirm only intended changes exist.
8. Deploy hosting only after the build succeeds:

```powershell
firebase use dankamf-eduplex
firebase deploy --only hosting
```

9. Deploy rules separately and review their security impact:

```powershell
firebase deploy --only firestore:rules,storage
```

10. Verify the live website after deployment using a private/incognito browser window.

## 14. Support information

For a technical incident, record:

- The exact URL.
- The signed-in role.
- The action being performed.
- The exact error message.
- Device, browser and orientation.
- Whether the issue occurs locally, in production or both.
- The approximate time of the incident.

This information makes debugging faster and prevents unnecessary changes to security rules or production data.

---

**Document owner:** Dankamf Educational Complex administration  
**Technical platform:** React, Firebase Authentication, Firestore, Firebase Storage and Firebase Hosting
