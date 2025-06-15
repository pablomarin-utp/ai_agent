# Futuristic AI Assistant Frontend

A cutting-edge React frontend application with dark theme, purple/neon accents, JWT authentication, credit system, and comprehensive admin panel.

## 🚀 Features

### Core Functionality
- **JWT Authentication**: Secure login/register with token-based authentication
- **Real-time Chat Interface**: Interactive AI assistant with credit system
- **Credit Management**: Track usage and manage credits with visual indicators
- **Rate Limiting**: Built-in rate limit handling with countdown timers
- **Responsive Design**: Mobile-first design with collapsible sidebar

### Admin Panel
- **User Management**: Activate/deactivate users, manage admin privileges
- **System Logs**: Monitor events, errors, and user activities
- **Configuration**: Manage system settings and AI parameters
- **Analytics**: Usage tracking and system monitoring

### Design & UX
- **Futuristic Theme**: Dark background with purple/neon accents
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Glassmorphism Effects**: Modern glass-like UI components
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🛠 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling with custom theme
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API calls
- **JWT Decode** for token handling
- **Recharts** for analytics visualization
- **React Hot Toast** for notifications

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd futuristic-ai-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your backend API URL:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, Modal, etc.)
│   └── layout/         # Layout components (Sidebar, Header, MainLayout)
├── pages/              # Page components
│   ├── admin/          # Admin panel pages
│   ├── Chat.tsx        # Main chat interface
│   ├── Login.tsx       # Authentication pages
│   └── ...
├── context/            # React Context providers
├── services/           # API service layer
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── styles/             # Global styles and Tailwind config
```

## 🎨 Theme Customization

The application uses a custom Tailwind theme with futuristic colors:

```javascript
// Primary purple/neon colors
primary: {
  500: '#a855f7',
  600: '#9333ea',
  700: '#7c3aed',
}

// Dark theme colors
dark: {
  800: '#1e293b',
  900: '#0f172a',
  950: '#0f0f1a',
}

// Neon accents
neon: {
  purple: '#8A2BE2',
  blue: '#00BFFF',
  green: '#39FF14',
}
```

## 🔐 Authentication Flow

1. **Registration**: Users register with email/password
2. **Activation**: Admin approval required for account activation
3. **Login**: JWT token issued upon successful authentication
4. **Protected Routes**: Token validation for accessing secured pages
5. **Auto-logout**: Automatic logout on token expiration

## 💳 Credit System

- **Initial Credits**: New users receive default credits
- **Usage Tracking**: Credits deducted per AI interaction
- **Visual Indicators**: Real-time credit display and warnings
- **Rate Limiting**: Prevents abuse with countdown timers

## 👨‍💼 Admin Features

### User Management
- View all registered users
- Activate/deactivate accounts
- Grant/revoke admin privileges
- Delete user accounts
- Search and filter capabilities

### System Monitoring
- Real-time system logs
- Event tracking and filtering
- Export logs to CSV
- Error monitoring and alerts

### Configuration
- AI model settings
- Credit system parameters
- Security configurations
- Rate limiting controls

## 🚀 Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

3. **Deploy to your preferred platform**
   - Vercel: Connect your repository for automatic deployments
   - Netlify: Drag and drop the `dist` folder
   - AWS S3: Upload build files to S3 bucket

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |
| `VITE_APP_NAME` | Application name | `AI Assistant` |
| `VITE_ENABLE_REGISTRATION` | Enable user registration | `true` |

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting (configure as needed)

## 🤝 API Integration

The frontend expects a FastAPI backend with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user

### Chat
- `POST /chat` - Send chat message
- `GET /chat/history` - Get chat history

### User
- `GET /user/usage` - Get usage statistics
- `PATCH /user/profile` - Update user profile

### Admin
- `GET /admin/users` - List all users
- `PATCH /admin/users/{id}` - Update user
- `DELETE /admin/users/{id}` - Delete user
- `GET /admin/logs` - Get system logs
- `GET /admin/config` - Get system configuration
- `PATCH /admin/config` - Update system configuration

## 📱 Mobile Support

The application is fully responsive with:
- Mobile-first design approach
- Touch-friendly interface
- Collapsible navigation
- Optimized layouts for all screen sizes

## 🎯 Performance

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Optimized Images**: Proper image optimization
- **Bundle Analysis**: Use `npm run build` to analyze bundle size

## 🔒 Security

- **XSS Protection**: Input sanitization and validation
- **CSRF Protection**: Token-based authentication
- **Secure Storage**: Proper token storage practices
- **Route Protection**: Authentication guards on protected routes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information
4. Contact the development team

---

Built with ❤️ using React, TypeScript, and modern web technologies.