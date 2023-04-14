# socialmedia_RestAPI

This project is a backend application for a social media platform. It provides endpoints for
users to create accounts, post content, follow other users, and interact with posts.

## Technologies Used
- Node.js
- Express.js
- Mongoose
- dotenv
- helmet
- morgan
- bcrypt

## Installation
- Run `npm install` to install the required dependencies.
- Create a `.env` file and set your environment variables.
- Run `npm start` to start the server.

#### To use this project, you can send HTTP requests to its endpointsusing tools such as Postman or cURL.

## Routes

- `POST /api/auth/register`: Create a new user account.

- `POST /api/auth/login`: Login with an existing user account.

- `PUT /api/users/:id`: Update a user account.

- `DELETE /api/users/:id`: Delete a user account.

- `GET /api/users/:id`: Get a user's profile.

- `PUT /api/users/:id/follow`: Follow a user.

- `PUT /api/users/:id/unfollow`: Unfollow a user.

- `POST /api/posts`: Create a new post.

- `PUT /api/posts/:id`: Update a post.

- `DELETE /api/posts/:id`: Delete a post.

- `GET /api/posts/timeline/all`: Get all posts from followed users.

- `GET /api/posts/:id`: Get a specific post.

## HTTP codes

- `400`: Validation error.
- `401`: Unauthorized access.
- `403`: Forbidden access.
- `404`: Resource not found.
- `500`: Server error.
- `409`: Conflict error.
- `200`: Successful request.
- `201`: Successful post.

Errors are returned in the response body, in JSON

