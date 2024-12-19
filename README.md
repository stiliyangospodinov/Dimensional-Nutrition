# Dimensional Nutrition

Dimensional Nutrition is an Angular-based application for dietary supplements that uses Firebase for data storage and retrieval. The app provides different functionalities depending on the user type: public, registered users, and administrators.

---

## Table of Contents
1. [Description](#description)
2. [Features](#features)
   - [Public Section](#public-section)
   - [User Section](#user-section)
   - [Admin Section](#admin-section)
3. [Technologies](#technologies)
4. [Project Setup](#project-setup)
5. [Usage](#usage)
6. [Developers](#developers)

---

## Description

Dimensional Nutrition is a web application for browsing nutritional supplements and their details. Product data is retrieved from a dedicated Firebase-hosted database. The application is built with Angular and offers various features for both public and registered users.

---

## Features

### Public Section:
- Public users can browse the products listed on the site.
- Public users have limited access:
  - They cannot post comments.
  - They cannot like products.

### User Section (for registered users):
- Registered users have extended functionalities:
  - They can post, read, and delete their own comments.
  - They can like products.
  - They have access to their **Profile Page**, where they can:
    - View and update their profile details.
    - Save changes securely.

### Admin Section (for administrators):
- Admin users have full control over the products listed on the site:
  - Access to an additional **"Create Product"** menu item in the header.
  - They can create new products by filling out a form with details like name, image, price, tags, description, and rating.
  - They can edit existing products, changing their details as needed.
  - They can delete products from the database, which removes them from the site entirely.

**Admin Credentials:**
- **Username:** admin@abv.bg
- **Password:** admin1

---

## Technologies

The project uses the following technologies:
- **Angular** – The main JavaScript framework for building the web application.
- **Firebase** – Used for data storage and retrieval (back-end).
- **HTML5**, **CSS3**, **TypeScript** – For front-end development.

---

## Project Setup

Follow these steps to set up and run the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/stiliyangospodinov/Dimensional-Nutrition.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd DimensionalNutrition
   ```

3. **Install the dependencies:**
   ```bash
   npm install
   ```

4. **Start the application:**
   ```bash
   ng serve
   ```

5. **Open the application locally in a browser at:**
   ```
   http://localhost:4200
   ```

---

## Usage

Once the application is running, you can register or log in as a user to access the full feature set.

### Features for Registered Users:
- Add and delete comments.
- Like products and interact with other users.

### Public Users:
- View product information but cannot interact with the products (likes, comments).

---

## Developers

This project was developed by:
- **Stiliyan Gospodinov**

---
