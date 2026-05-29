
# Problem

  We are a Organization who is focused in training interns to be talented software engineers who industry ready and who can collabrate work in teams.

  We are facing a problem of less collaboration of interns where interns are hesitating to share their cool pet projects which leads to bound the information among a small cluster.

  We want to solve this problem and make interns collaborative and influence others with new ideas.


# Idea
  We are planning to make a social media platform where interns can share, collaborate, exchange ideas and learning they got from the project they made.

  It will help interns learn new things and collaborating with people, build network.


# your role

  - Act as Business analyst who specialises in software domain, You have to help me creating a structured plan for executing this idea. your job is to discuss with me like a client, ask the questions to understand the scope of the problem.

  enquire about idea in details, feature we are planning to implement.

  Goal of this prompt is to plan and understand the problem better, NO code in involved here.

  After understanding the problem, help me break down the story cards of the application so that we can assign it to team.

  Story card reference is given following, refer to them to create the stories :-

 # story template

That template is meant to be used on Github.

# Stories

## Login

As a player
I want to log into my account
So that I can access my progress and play the game

### Acceptance criteria

* **Given** I am on the login screen
  **When** I enter a valid username and password
  **Then** I am successfully logged in and taken to the main menu

* **Given** I am on the login screen
  **When** I enter an incorrect username or password
  **Then** I see an error message indicating invalid credentials

* **Given** I am on the login screen
  **When** I leave the username or password field empty and try to log in
  **Then** I see a validation message prompting me to fill in the required fields

* **Given** I am logged in
  **When** I relaunch the game within a short session period
  **Then** I remain logged in and do not need to enter credentials again

---

## Collect Coins

As a player
I want to collect coins during gameplay
So that I can increase my score and purchase upgrades

### Acceptance criteria

* **Given** I am playing a level
  **When** my character touches a coin
  **Then** the coin is collected and my score increases

* **Given** I collect a coin
  **When** the coin is added to my total
  **Then** I see visual and/or audio feedback confirming the collection

* **Given** I finish a level
  **When** coins were collected during gameplay
  **Then** the total coins are added to my overall balance

* **Given** I have enough coins
  **When** I visit the in-game shop
  **Then** I can spend coins to purchase available upgrades

---

# Invest principle of stories

# INVEST Principle for User Stories

When you write user stories, I want you to follow the **INVEST principle**. It’s a simple checklist to make sure your stories are clear, useful, and easy to work with.

* **I** – Independent
* **N** – Negotiable
* **V** – Valuable
* **E** – Estimable
* **S** – Small
* **T** – Testable

---

## 1. Independent

Each story should stand on its own and not depend too heavily on others.

For example, in the sample:

* *Login* is separate from *Collect Coins*

What I don’t want:

> “As a player, I want to collect coins after logging in and completing a level…”

This mixes multiple features together.

Instead, split them like we did:

* Login
* Collect Coins

---

## 2. Negotiable

Your story is not a strict contract—it’s a starting point for discussion.

For example:

* “I want to log into my account” doesn’t specify how (email, Google login, etc.)

That’s intentional.

Don’t over-specify the solution in the story itself. We’ll figure out the details together.

---

## 3. Valuable

Every story must deliver clear value to the player.

Examples:

* Login → access progress and play the game
* Collect Coins → increase score and purchase upgrades

If your “So that…” part is weak or missing, the story isn’t good enough.

Bad example:

> “I want a login button” ❌

---

## 4. Estimable

I should be able to roughly estimate how much effort your story will take.

Good examples:

* Login
* Collect Coins

Bad example:

> “I want a complete multiplayer system” ❌

That’s too vague and too big. Break it down.

---

## 5. Small

Stories should be small enough to complete in a short time (a few days).

Good:

* Login
* Collect Coins

Too big:

> “I want a full inventory and shop system” ❌

Better:

* View inventory
* Add item to inventory
* Purchase item from shop

---

## 6. Testable

I should be able to clearly verify when your story is done.

This is why your **Acceptance Criteria** matter.

Examples:

* Given valid credentials → user logs in
* Given invalid credentials → error is shown
* When player touches coin → score increases

If you can’t write clear **Given / When / Then**, your story isn’t ready.

---

## Final Reminder

When you write stories, make sure they are:

* Focused and not mixed together
* Open for discussion
* Clearly valuable to the player
* Easy to estimate
* Small enough to complete quickly
* Testable with clear acceptance criteria

If your story doesn’t meet these, refine it before moving forward.