# 🚀 Deployment Guide - Cafe Management System

Hướng dẫn deploy hệ thống lên production.

## 📋 Mục Lục

1. [Local Development](#local)
2. [Production Deployment](#production)
3. [Database Migration](#database)
4. [Security Hardening](#security)
5. [Monitoring](#monitoring)

---

## <a id="local"></a>💻 Local Development Setup

### Prerequisites

- Node.js v14+
- MySQL 5.7+
- npm 6+

### Installation Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd "xay-dung-quan-li-he-thong-cafe"

# 2. Setup Backend
cd Backend
npm install

# 3. Create .env file
cp .env.example .env

# 4. Configure database
# Edit .env with your database credentials

# 5. Create database
mysql -u root -p < ../Database/schema.sql
mysql -u root -p < ../Database/data.sql

# 6. Start backend
npm run dev

# 7. Start frontend (new terminal)
cd ../
python -m http.server 8000
```

### Access Application

- **Frontend:** `http://localhost:8000`
- **Backend:** `http://localhost:5000`
- **API Docs:** `http://localhost:5000/api-docs`

---

## <a id="production"></a>🌐 Production Deployment

### Option 1: Traditional VPS (Ubuntu/Debian)

#### Step 1: Prepare Server

```bash
# Update system
sudo apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### Step 2: Configure MySQL

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database
mysql -u root -p < schema.sql
mysql -u root -p < data.sql
```

#### Step 3: Deploy Backend

```bash
# Clone repository
cd /var/www
git clone <repository-url> cafe-system
cd cafe-system/Backend

# Install dependencies
npm install --production

# Create production .env
nano .env
# Configure for production:
# PORT=3000
# NODE_ENV=production
# DB_HOST=localhost
# DB_USER=cafe_user
# DB_PASSWORD=secure_password_here
# JWT_SECRET=production_secret_key_change_this

# Start with PM2
pm2 start app.js --name "cafe-backend"
pm2 save
pm2 startup
```

#### Step 4: Deploy Frontend

```bash
# Build frontend (if using build system)
cd ../Frontend

# Create production build
# Copy to nginx document root
sudo cp -r . /var/www/html/cafe-frontend/
```

#### Step 5: Configure Nginx

Create `/etc/nginx/sites-available/cafe-system`:

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        root /var/www/html/cafe-frontend;
        try_files $uri $uri/ /index.html;
    }

    # Redirect API requests to backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SSL (Let's Encrypt)
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

Enable and test:

```bash
sudo ln -s /etc/nginx/sites-available/cafe-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
sudo systemctl restart nginx
```

### Option 2: Docker Deployment

#### Dockerfile (Backend)

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: cafe_management_system
    volumes:
      - mysql_data:/var/lib/mysql
      - ./Database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "3306:3306"

  backend:
    build: ./Backend
    depends_on:
      - mysql
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: rootpass
      DB_NAME: cafe_management_system
      NODE_ENV: production
    ports:
      - "3000:3000"

  frontend:
    image: nginx:alpine
    volumes:
      - ./Frontend:/usr/share/nginx/html:ro
    ports:
      - "80:80"

volumes:
  mysql_data:
```

Deploy:

```bash
docker-compose up -d
```

### Option 3: Heroku Deployment

#### Procfile

```
web: node Backend/app.js
```

#### Deploy

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create cafe-management-system

# Add MySQL (ClearDB)
heroku addons:create cleardb:punch

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## <a id="database"></a>💾 Database Migration

### Backup Database

```bash
# Backup
mysqldump -u root -p cafe_management_system > backup_$(date +%Y%m%d).sql

# Restore
mysql -u root -p cafe_management_system < backup_20260415.sql
```

### Database Updates

```sql
-- Add new column
ALTER TABLE products ADD COLUMN image_url VARCHAR(255);

-- Update data
UPDATE products SET status = 'active' WHERE status IS NULL;

-- Create index for performance
CREATE INDEX idx_order_date ON orders(order_date);
```

---

## <a id="security"></a>🔐 Security Hardening

### 1. Environment Variables

Never commit `.env` file. Use `.env.example`:

```
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password (CHANGE THIS!)
JWT_SECRET=very_long_random_secret_key_CHANGE_THIS
NODE_ENV=production
```

### 2. Database Security

```sql
-- Create app user (not root)
CREATE USER 'cafe_app'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON cafe_management_system.* TO 'cafe_app'@'localhost';
FLUSH PRIVILEGES;
```

### 3. SSL/TLS Certificate

Install and auto-renew with Certbot:

```bash
sudo certbot renew --dry-run  # Test renewal
```

### 4. Rate Limiting

Add to app.js:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 5. CORS Configuration

```javascript
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 6. Input Validation

```javascript
// Validate and sanitize inputs
const { validationResult, body } = require('express-validator');

router.post('/login', [
    body('username').trim().escape(),
    body('password').isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Process login
});
```

---

## <a id="monitoring"></a>📊 Monitoring & Logging

### 1. PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs cafe-backend

# Setup log rotation
pm2 install pm2-logrotate
pm2 save
```

### 2. Error Tracking (Sentry)

```bash
npm install @sentry/node
```

```javascript
const Sentry = require("@sentry/node");

Sentry.init({ 
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0
});

app.use(Sentry.Handlers.errorHandler());
```

### 3. Performance Monitoring

```javascript
// Add response time logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});
```

### 4. Database Monitoring

Monitor with:
- MySQL: `SHOW PROCESSLIST;`
- Monitor slow queries in `/var/log/mysql/slow.log`

---

## 🔍 Pre-Deployment Checklist

- ✅ All tests passing
- ✅ Environment variables configured
- ✅ Database backup created
- ✅ SSL certificate installed
- ✅ Rate limiting enabled
- ✅ Error logging configured
- ✅ CORS properly configured
- ✅ JWT secret changed
- ✅ Database user credentials changed
- ✅ Firewall rules configured
- ✅ Load balancer configured (if needed)
- ✅ Backup strategy documented

---

## 🚨 Rollback Procedure

```bash
# Revert to previous version
git revert <commit-hash>
git push

# Restart service
pm2 restart cafe-backend

# Or rollback database
mysql -u root -p cafe_management_system < backup_20260410.sql
```

---

## 📞 Support & Maintenance

- **Logs:** `/var/log/nginx/`, `/var/log/mysql/`
- **Cron Jobs:** For automated backups
  ```bash
  0 2 * * * mysqldump -u root -p cafe_management_system > /backups/cafe_$(date +%Y%m%d).sql
  ```
- **Updates:** Regular security patches for Node.js and dependencies

---

**Deployment Guide v1.0** | April 15, 2026
