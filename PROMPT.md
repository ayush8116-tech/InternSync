Role & Goal: You are a Senior Developer and Architect pairing with me to implement user stories for an Epic. Your primary goal is to help me design, break down, and implement these stories perfectly.

Core Directives (CRITICAL):

NO ASSUMPTIONS: Never assume a tech stack, library, file structure, or business logic rule. Ask before finalizing the decision.

ALWAYS VERIFY: Before moving to the next step, you must explicitly ask for my approval.

ONE STEP AT A TIME: Do not jump ahead. Wait for my answers before proceeding.

The Workflow: We will follow these phases strictly.

Phase 1: Story Comprehension

I will provide the story card details.

You will summarize your understanding of the story's goal and user value.

STOP AND ASK: "Did I understand this correctly, or are there nuances I missed?"

Phase 2: Technical Alignment

Once the story is understood, ask me what tech stack, frameworks, or specific libraries we are using for this specific card.

If I ask for recommendations, provide 2-3 options with pros/cons, then wait for my decision.

STOP AND ASK: "Can you confirm this is the exact stack and environment we are using?"

Phase 3: Task Breakdown & Architecture

Break the story down into a checklist of concrete, actionable technical steps (e.g., UI changes, API endpoints, database schema updates).

STOP AND ASK: "Does this step-by-step plan look correct? Should we add, remove, or modify any steps?"

Phase 4: TDD Iterative Implementation

We will execute the checklist one step at a time using strict Test-Driven Development (TDD).

RED: First, write the failing test cases for Step 1 only.

STOP AND ASK: "Do these test cases accurately cover the requirements and edge cases for this step? May I proceed to write the implementation code?"

GREEN: Once I approve the tests, write the minimum implementation code required to make the tests pass.

REFACTOR: STOP AND ASK: "The tests should now be passing. Does this implementation look clean, or should we refactor the code before moving on to next step ?"

## Important note
 - Test every code thoroughly
  - test avery aspect of code so that it will not break in production.
  - write tests for the code you will write

## Epics to implement

---

## Epic 1: Authentication

### Story 1 — Login with GitHub

As an intern or mentor
I want to log in using my GitHub account
So that I can access the platform securely without creating a new password

#### Acceptance Criteria

* **Given** I am on the login page
  **When** I click "Login with GitHub"
  **Then** I am redirected to GitHub's OAuth authorization page

* **Given** I have authorized the app on GitHub
  **When** GitHub redirects me back to the platform
  **Then** I am logged in and taken to the home feed

* **Given** I have previously logged in
  **When** I return to the platform within an active session
  **Then** I remain logged in without needing to re-authorize

* **Given** my GitHub account is not associated with the allowed organization
  **When** I attempt to log in
  **Then** I see an error message stating that access is restricted to organization members

---

### Story 2 — Logout

As a logged-in user
I want to log out of my account
So that my session is secure on shared devices

#### Acceptance Criteria

* **Given** I am logged in
  **When** I click the logout option
  **Then** my session is ended and I am redirected to the login page

* **Given** I have logged out
  **When** I try to access a protected page directly
  **Then** I am redirected to the login page

---

## Epic 2: User Profile

### Story 3 — View Own Profile

As a logged-in user
I want to view my own profile page
So that I can see how my profile appears to others

#### Acceptance Criteria

* **Given** I am logged in
  **When** I navigate to my profile page
  **Then** I see my GitHub profile photo, display name, bio, and a list of all my posted projects

* **Given** I have not posted any projects yet
  **When** I view my profile
  **Then** I see an empty state message encouraging me to post my first project

---

### Story 4 — Edit Profile Bio

As a logged-in user
I want to edit my profile bio
So that I can introduce myself to other interns and mentors

#### Acceptance Criteria

* **Given** I am on my profile page
  **When** I click "Edit Profile"
  **Then** I can update my bio text and save it

* **Given** I save an updated bio
  **When** others view my profile
  **Then** they see my updated bio text

* **Given** I save an empty bio
  **When** others view my profile
  **Then** the bio section is gracefully hidden rather than showing a blank space

---

### Story 5 — View Another User's Profile

As a logged-in user
I want to view another user's profile
So that I can explore all the projects they have shared

#### Acceptance Criteria

* **Given** I click on an author's name on any project post
  **When** their profile page loads
  **Then** I see their GitHub photo, name, bio, and a list of all their posted projects

* **Given** a user has not posted any projects yet
  **When** I view their profile
  **Then** I see an empty state message instead of a post list

---

## Epic 3: Project Posts

### Story 6 — Create Project Post [X]

As an intern or mentor
I want to create a project showcase post
So that I can share my work and inspire others in the team

#### Acceptance Criteria

* **Given** I am logged in
  **When** I click "Create Post"
  **Then** I see a form with fields for: title, description, GitHub repo link, demo link, screenshots (upload), and tech stack tags

* **Given** I have filled in at least the title and description
  **When** I submit the post
  **Then** my project post is published and appears in the home feed

* **Given** I leave the title or description blank
  **When** I try to submit
  **Then** I see a validation error prompting me to fill in the required fields

* **Given** I add a GitHub repo link or demo link
  **When** the post is published
  **Then** both links are shown as clickable URLs on the post

* **Given** I upload screenshots
  **When** the post is published
  **Then** the screenshots are displayed within the post

---

### Story 7 — View Project Post Detail [X]

As a logged-in user
I want to open a project post to read its full details
So that I can learn more about the project and its context

#### Acceptance Criteria

* **Given** I see a post in the feed
  **When** I click on it
  **Then** I am taken to the post detail page showing: full description, GitHub and demo links, screenshots, tech stack tags, like count, and comments

---

### Story 8 — Edit Own Project Post [X]

As an intern or mentor
I want to edit my own project post
So that I can correct mistakes or add new updates to the project

#### Acceptance Criteria

* **Given** I am viewing my own post
  **When** I click "Edit"
  **Then** I see the post form pre-filled with my current content

* **Given** I update the content and submit
  **When** the form is saved
  **Then** the post is updated and the changes are immediately visible to everyone

* **Given** I am viewing someone else's post
  **When** I look at the post options
  **Then** I do not see an edit option

---

### Story 9 — Delete Own Project Post

As an intern or mentor
I want to delete my own project post
So that I can remove content that is no longer relevant or accurate

#### Acceptance Criteria

* **Given** I am viewing my own post
  **When** I click "Delete" and confirm the action
  **Then** the post is permanently removed and no longer appears in any feed

* **Given** I am viewing someone else's post
  **When** I look at the post options
  **Then** I do not see a delete option

---

## Epic 4: Discovery

### Story 10 — View Home Feed [X]

As a logged-in user
I want to see a feed of all recently shared project posts
So that I can discover what others across the team are building

#### Acceptance Criteria

* **Given** I am logged in
  **When** I visit the home page
  **Then** I see a list of project posts sorted by most recent first

* **Given** there are posts in the feed
  **When** I view the feed
  **Then** each post card shows the title, author name, tech stack tags, and like count

* **Given** there are many posts
  **When** I scroll to the bottom of the current list
  **Then** more posts are loaded (pagination or infinite scroll)

---

### Story 11 — Search Projects by Keyword

As a logged-in user
I want to search for projects by keyword
So that I can quickly find a specific project I heard about

#### Acceptance Criteria

* **Given** I am on any page
  **When** I type a keyword into the search bar and submit
  **Then** I see a list of posts whose title or description contains the keyword

* **Given** my search returns no matching results
  **When** I view the results page
  **Then** I see a message indicating no projects match my search term

---

### Story 12 — Filter Projects by Tech Stack Tag

As a logged-in user
I want to filter project posts by a tech stack tag
So that I can explore all projects built with a specific technology

#### Acceptance Criteria

* **Given** I am viewing the home feed or any project list
  **When** I click on a tech stack tag (e.g., "React")
  **Then** the feed updates to show only projects that include that tag

* **Given** I am viewing tag-filtered results
  **When** I click the active tag again or click "Clear filter"
  **Then** I return to the unfiltered feed showing all projects

---

## Epic 5: Engagement

### Story 13 — Like a Project Post

As a logged-in user
I want to like a project post
So that I can show appreciation for someone's work

#### Acceptance Criteria

* **Given** I am viewing a post I have not yet liked
  **When** I click the like button
  **Then** the like count increases by 1 and the button reflects my liked state

* **Given** I have already liked a post
  **When** I click the like button again
  **Then** my like is removed and the count decreases by 1

---

### Story 14 — Comment on a Project Post

As a logged-in user
I want to leave a comment on a project post
So that I can give feedback or ask questions about the project

#### Acceptance Criteria

* **Given** I am on the project post detail page
  **When** I write a comment in the input field and submit
  **Then** my comment appears in the comments section with my name and the timestamp

* **Given** I try to submit an empty comment
  **When** I click the submit button
  **Then** I see a validation error and no comment is posted

---

### Story 15 — Delete Own Comment

As a logged-in user
I want to delete a comment I posted
So that I can remove something I wrote by mistake

#### Acceptance Criteria

* **Given** I am viewing my own comment on a post
  **When** I click "Delete" on that comment
  **Then** the comment is immediately removed from the post

* **Given** I am viewing someone else's comment
  **When** I look at the comment options
  **Then** I do not see a delete option

---

## Story Index

| # | Story | Epic |
|---|---|---|
| 1 | Login with GitHub | Authentication |
| 2 | Logout | Authentication |
| 3 | View Own Profile | User Profile |
| 4 | Edit Profile Bio | User Profile |
| 5 | View Another User's Profile | User Profile |
| 6 | Create Project Post | Project Posts |
| 7 | View Project Post Detail | Project Posts |
| 8 | Edit Own Project Post | Project Posts |
| 9 | Delete Own Project Post | Project Posts |
| 10 | View Home Feed | Discovery |
| 11 | Search Projects by Keyword | Discovery |
| 12 | Filter Projects by Tech Stack Tag | Discovery |
| 13 | Like a Project Post | Engagement |
| 14 | Comment on a Project Post | Engagement |
| 15 | Delete Own Comment | Engagement |
