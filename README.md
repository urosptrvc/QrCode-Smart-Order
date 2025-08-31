# Smart Drink Ordering System via QR Code

A modern web application that allows customers to order drinks by scanning a QR code at their table. The system provides personalized drink recommendations based on table history and popular orders.

## Core Features

- **QR Code Table Identification**: Each table has a unique QR code that links to the menu with the table ID
- **Personalized Recommendations**: Customers receive drink recommendations based on table history and popular items
- **Real-time Order Management**: Staff can view and manage orders through an admin dashboard
- **Microservices Architecture**: Built with a modular approach for scalability

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL database

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/qrcode.git
   cd qrcode
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   # Create a .env file with the following content
   DATABASE_URL="mysql://username:password@localhost:3306/smart_drink_db"
   ```

4. Run database migrations
   ```bash
   npx prisma migrate dev
   ```

5. Seed the database with initial data
   ```bash
   npm run seed
   ```

6. Start the development server
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Customer Flow

1. Scan the QR code at your table
2. View the menu with personalized recommendations
3. Add items to your cart
4. Submit your order
5. Wait for your drinks to be delivered

### Staff Flow

1. Access the admin dashboard at `/admin/orders`
2. View incoming orders
3. Update order status (Pending, In Progress, Completed, Canceled)
4. Manage tables and products

## Project Structure

```
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── admin/        # Admin pages
│   │   ├── menu/         # Customer-facing menu
│   │   └── page.tsx      # Home page
│   ├── components/       # Reusable React components
│   └── lib/              # Utility functions and shared code
├── .env                  # Environment variables
└── package.json          # Project dependencies
```

## Future Enhancements

- User authentication for customers to track order history
- Payment integration
- Mobile app version
- Analytics dashboard for business insights
- Multi-language support
