# Deploying Your Todo List Application

This guide outlines how to deploy your full-stack Todo List application, which consists of:
- React/TypeScript frontend
- Node.js/Express backend
- MySQL database

## Database Deployment Options

Since your application uses MySQL, you'll need to use a database hosting service. Here are recommended options:

1. **PlanetScale** - MySQL-compatible serverless database platform
   - Free tier available
   - Seamless scaling
   - [PlanetScale Website](https://planetscale.com/)

2. **Railway** - Offers MySQL hosting with simple setup
   - Free tier available for development
   - [Railway Website](https://railway.app/)

3. **AWS RDS** - Managed MySQL service by Amazon
   - More complex setup but highly reliable
   - Free tier available for 12 months
   - [AWS RDS Website](https://aws.amazon.com/rds/)

4. **Digital Ocean Managed MySQL**
   - Starts at $15/month
   - [Digital Ocean Website](https://www.digitalocean.com/products/managed-databases-mysql)

## Backend Deployment

### Option 1: Vercel Serverless Functions (Limited)

You can deploy parts of your backend as serverless functions on Vercel, but with limitations:
- MySQL connections may time out due to serverless cold starts
- Not ideal for maintaining persistent database connections
- Good for simple API endpoints that don't require complex database operations

### Option 2: Render (Recommended)

Render offers web services that can run your Express app with persistent connections:
1. Sign up at [render.com](https://render.com/)
2. Create a new Web Service and connect your GitHub repository
3. Set environment variables for database connection
4. Deploy

### Option 3: Railway

Railway can host both your Node.js application and MySQL database:
1. Sign up at [railway.app](https://railway.app/)
2. Create a new project and connect your GitHub repository
3. Add a MySQL database to your project
4. Configure environment variables
5. Deploy

## Frontend Deployment on Vercel

1. Sign up at [vercel.com](https://vercel.com/)
2. Install Vercel CLI: `npm install -g vercel`
3. Create a `vercel.json` file in your client directory:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-url.com/api/:path*"
    }
  ]
}
```

4. Set up environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your deployed backend URL

5. Deploy from the client directory:
```bash
cd client
vercel
```

## Environment Variables Setup

For your backend deployment, you'll need to set these environment variables:

```
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=todolist
PORT=8080
```

For your frontend deployment on Vercel, set:

```
VITE_API_URL=https://your-backend-url.com/api
```

## Deployment Steps Checklist

1. Create and configure your MySQL database on a cloud provider
2. Update your database configuration to use environment variables
3. Deploy your backend to a hosting service like Render or Railway
4. Deploy your frontend to Vercel
5. Test your application to ensure everything works correctly

## Continuous Deployment

Both Vercel and recommended backend platforms support continuous deployment from GitHub:
1. Connect your repository
2. Configure build settings
3. Each push to your main branch will trigger automatic deployments

## Local Development vs. Production

When developing locally:
- Use `.env` files for environment variables
- Set `VITE_API_URL` to `http://localhost:3000/api` for local development
- Use local MySQL instance

For production:
- Configure environment variables in the respective deployment platforms
- Use your production database credentials
- Ensure CORS is properly configured for cross-domain requests
