# Message App

## Prerequisites

- Node.js version 20.17.0
- MongoDB

## Setup

1. Clone the repository:

   ```
   git clone https://github.com/atanwer/UsersAndMessagesCrud.git
   cd UsersAndMessagesCrud
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up the MongoDB database:

   - Start your MongoDB server
   - Connect to your MongoDB database

4. Create a `.development.env` file in the root directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/chat-app
   PORT=3000
   ```

## Running the Application

- For production:

  ```
  npm start
  ```

- For development:
  ```
  npm run dev
  ```
