Dimensional Nutrition

Dimensional Nutrition is an Angular-based application for dietary supplements that uses Firebase for data storage and retrieval. The app provides different functionalities depending on the user type: public and registered users.
Table of Contents

    Description
    Features
    Technologies
    Project Setup
    Usage
    Developers
    License

Description

Dimensional Nutrition is a web application for browsing nutritional supplements and their details. Product data is retrieved from a dedicated Firebase-hosted database. The application is built with Angular and offers various features for both public and registered users.
Features
Public Section:

    Public users can browse the products listed on the site.
    Public users have limited access:
        They cannot post comments.
        They cannot like products.

User Section (for registered users):

    Registered users have extended functionalities:
        They can post, read, and delete their own comments.
        They can like products.

Technologies

The project uses the following technologies:

    Angular – The main JavaScript framework for building the web application.
    Firebase – Used for data storage and retrieval (back-end).
    HTML5, CSS3, TypeScript – For front-end development.

Project Setup

    Clone the repository:

    bash

git clone https://github.com/your-username/Dimensional-Nutrition.git

Navigate to the project directory:

bash

cd DimensionalNutrition

Install the dependencies:

bash

npm install

Start the application:

bash

ng serve

Open the application in a browser at:

bash

    http://localhost:4200

Usage

Once the application is running, you can register or log in as a user to access the full feature set. Public users can only view product information but cannot interact with the products (likes, comments).
Features for Registered Users:

    Add and delete comments.
    Like products and interact with other users.

Developers

This project was developed by:

    Stiliyan Gospodinov

