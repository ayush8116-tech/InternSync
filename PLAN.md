

## Epic 3: Project Posts

---

### Create Project Post

As an intern or mentor I want to create a project showcase post So that I can
share my work and inspire others in the team

#### Acceptance Criteria

- **Given** I am logged in **When** I click "Create Post" **Then** I see a form
  with fields for: title, description, GitHub repo link, demo link, screenshots
  (upload), and tech stack tags

- **Given** I have filled in at least the title and description **When** I
  submit the post **Then** my project post is published and appears in the home
  feed

- **Given** I leave the title or description blank **When** I try to submit
  **Then** I see a validation error prompting me to fill in the required fields

- **Given** I add a GitHub repo link or demo link **When** the post is published
  **Then** both links are shown as clickable URLs on the post

- **Given** I upload screenshots **When** the post is published **Then** the
  screenshots are displayed within the post

---

### View Project Post Detail

As a logged-in user I want to open a project post to read its full details So
that I can learn more about the project and its context

#### Acceptance Criteria

- **Given** I see a post in the feed **When** I click on it **Then** I am taken
  to the post detail page showing: full description, GitHub and demo links,
  screenshots, tech stack tags, like count, and comments

---

### Edit Own Project Post

As an intern or mentor I want to edit my own project post So that I can correct
mistakes or add new updates to the project

#### Acceptance Criteria

- **Given** I am viewing my own post **When** I click "Edit" **Then** I see the
  post form pre-filled with my current content

- **Given** I update the content and submit **When** the form is saved **Then**
  the post is updated and the changes are immediately visible to everyone

- **Given** I am viewing someone else's post **When** I look at the post options
  **Then** I do not see an edit option

---

### Delete Own Project Post

As an intern or mentor I want to delete my own project post So that I can remove
content that is no longer relevant or accurate

#### Acceptance Criteria

- **Given** I am viewing my own post **When** I click "Delete" and confirm the
  action **Then** the post is permanently removed and no longer appears in any
  feed

- **Given** I am viewing someone else's post **When** I look at the post options
  **Then** I do not see a delete option
