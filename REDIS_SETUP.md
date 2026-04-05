# Redis Setup & Configuration for BrewCraft

## Current Configuration

**Updated Files:**
- ✅ `.env` - Set CACHE_DRIVER=redis and Redis connection details
- ✅ `config/redis.php` - Redis database configuration
- ✅ `config/cache.php` - Already supports Redis

**Current Setup:**
```env
CACHE_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_DB=0
REDIS_CACHE_DB=1
```

## Installation Guide

### Option 1: Using Windows Subsystem for Linux (WSL2) - RECOMMENDED

**Advantages:**
- Native Linux environment
- Best performance
- Easy to manage with standard Linux tools

**Steps:**

1. **Enable WSL2:**
   ```powershell
   # Open PowerShell as Administrator
   wsl --install
   wsl --set-default-version 2
   ```

2. **Install Redis in WSL:**
   ```bash
   # Inside WSL terminal
   sudo apt update
   sudo apt install redis-server
   ```

3. **Start Redis:**
   ```bash
   # Start Redis server
   redis-server
   
   # In another WSL terminal, test connection
   redis-cli ping
   # Should output: PONG
   ```

### Option 2: Using Laragon - IF YOU HAVE IT

If you're using Laragon (full-stack LAMP):

1. **Enable Redis:**
   - Open Laragon → Menu → Services
   - Enable "Redis"
   - Click "Start"

2. **Verify it's running:**
   ```bash
   redis-cli ping
   # Should output: PONG
   ```

### Option 3: Using Docker - EASIEST

**Prerequisite:** Docker Desktop installed

**Steps:**

1. **Create docker-compose.yml in project root:**
   ```yaml
   version: '3.8'
   
   services:
     redis:
       image: redis:7-alpine
       ports:
         - "6379:6379"
       command: redis-server
       restart: unless-stopped
   ```

2. **Start Redis:**
   ```bash
   docker-compose up -d redis
   ```

3. **Verify it's running:**
   ```bash
   docker-compose exec redis redis-cli ping
   # Should output: PONG
   ```

### Option 4: Manual Installation on Windows (NOT RECOMMENDED)

**Download from:**
- https://github.com/microsoftarchive/redis/releases (Official Microsoft port)
- Or use Memurai: https://www.memurai.com/

**Not recommended because:**
- Maintenance is no longer active
- Use WSL2 or Docker instead

## Verifying Redis Connection

### Step 1: Start Redis
```bash
# Using WSL
redis-server

# Or Docker
docker-compose up -d redis
```

### Step 2: Test with Redis CLI
```bash
# Connect to Redis
redis-cli

# Should see Redis prompt:
127.0.0.1:6379>

# Test commands:
ping
# Expected: PONG

set foo bar
# Expected: OK

get foo
# Expected: "bar"

exit
```

### Step 3: Test from Laravel
```bash
# In project directory
php artisan tinker

# Test Redis connection
>>> Redis::ping()
'PONG'  // Success!

>>> Redis::set('test_key', 'test_value')
true

>>> Redis::get('test_key')
"test_value"

>>> exit
```

## Clear Caches After Setup

```bash
# Clear all caches
php artisan cache:clear
php artisan view:clear
php artisan config:clear

# Or combined
php artisan optimize:clear
```

## Verify Redis is Being Used

### Check Redis keys:
```bash
redis-cli
127.0.0.1:6379> select 1  # Switch to cache DB
127.0.0.1:6379[1]> keys *  # List all cache keys
# Should show Laravel cache keys like:
# 1) "laravel_db:laravel_cache:1b2ff2d0a..."
```

### Monitor Redis in real-time:
```bash
redis-cli monitor
# Shows every Redis command as it happens
# Try browsing your app and you'll see cache operations
```

## Performance Benefits

| Feature | File Cache | Redis |
|---------|-----------|-------|
| Speed | Disk I/O | In-Memory |
| Concurrency | Okay | Excellent |
| Scale | Single server | Cluster support |
| TTL Handling | Manual cleanup | Automatic |
| Atomic Operations | Basic | Advanced |
| **Best for** | Development | Production |

## Configuration Explanation

**`.env` Redis settings:**
```env
CACHE_DRIVER=redis      # Use Redis for caching
REDIS_HOST=127.0.0.1    # Redis server address
REDIS_PASSWORD=null     # No password (development)
REDIS_PORT=6379         # Default Redis port
REDIS_DB=0              # Default database
REDIS_CACHE_DB=1        # Cache-specific database
```

**`config/redis.php` setup:**
```php
'default' => [
    // Used for sessions and general Redis operations
    'database' => 0,
],

'cache' => [
    // Used specifically for caching
    'database' => 1,  // Separate DB keeps data organized
],
```

## Using Redis for More Than Caching (OPTIONAL)

You can also use Redis for:

### 1. Session Storage (More Performant)
```env
SESSION_DRIVER=redis  # Instead of file
```

### 2. Queue Driver (Background Jobs)
```env
QUEUE_CONNECTION=redis  # For email, notifications, etc.
```

### 3. Locks & Rate Limiting
```php
// Already works with Redis configured
Cache::lock('resource')->get(function () {
    // Critical section
});
```

## Troubleshooting

### Error: "Connection refused" on port 6379
**Solution:**
```bash
# Verify Redis is running
redis-cli ping

# If no response, start Redis:
# WSL: redis-server
# Docker: docker-compose up -d redis
# Laragon: Use menu to start Redis
```

### Error: "NOAUTH Authentication required"
**Solution 1 - If you added a password:**
```env
REDIS_PASSWORD=your_password
```

**Solution 2 - Remove password (development):**
```env
REDIS_PASSWORD=null
```

### Redis commands slow
**Solution:** Check Redis memory usage
```bash
redis-cli info memory

# If memory is high, consider clearing old data:
redis-cli FLUSHDB  # Clear current DB
redis-cli FLUSHALL # Clear ALL databases (⚠️ careful!)
```

### Cache not being used
**Verify configuration:**
```bash
# Check .env
cat .env | grep CACHE_DRIVER  # Should show: redis

# Check config file exists
ls config/redis.php

# Test connection in Laravel
php artisan tinker
>>> config('cache.default')
"redis"

>>> Redis::ping()
"PONG"
```

## Monitoring Redis

### Real-time monitoring:
```bash
redis-cli monitor
```

### Memory usage:
```bash
redis-cli info memory
```

### Statistics:
```bash
redis-cli info stats
```

### Connected clients:
```bash
redis-cli info clients
```

### Clear cache if needed:
```bash
redis-cli FLUSHDB  # Only cache DB (DB 1)
```

## Next Steps

### ✅ Immediate
1. [Choose installation method above and setup Redis]
2. Verify Redis is running: `redis-cli ping`
3. Test Laravel connection: `php artisan tinker` → `Redis::ping()`
4. Clear caches: `php artisan optimize:clear`
5. Test application: Browse to http://localhost:8000

### 📊 Monitor
1. Run `redis-cli monitor` to see cache operations
2. Check performance improvement vs file cache
3. Monitor memory usage

### 🔒 For Production
1. Set strong REDIS_PASSWORD
2. Use Redis persistence (AOF or RDB)
3. Set up Redis monitoring and alerts
4. Consider Redis cluster for high availability
5. Add Redis backup to your deployment

## Docker Compose Example (Full Stack)

Save as `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  # MongoDB for database
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: ecommerce
    volumes:
      - mongo_data:/data/db

  # Redis for caching
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server
    volumes:
      - redis_data:/data

  # PHP Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DB_HOST=mongodb
      - DB_PORT=27017
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - mongodb
      - redis
    volumes:
      - .:/app
    command: php artisan serve --host=0.0.0.0

volumes:
  mongo_data:
  redis_data:
```

**Run with:**
```bash
docker-compose up -d
```

---

## Summary

✅ **Redis Configuration:**
- Updated `.env` with Redis settings
- Created `config/redis.php`
- Using separate database for caching (DB 1)

✅ **Installation Options:**
- WSL2 (Recommended)
- Docker (Easiest if you have it)
- Laragon (If using Full-Stack)
- Manual (Not recommended)

✅ **Performance:**
- Redis is 10-100x faster than file caching
- Perfect for high-traffic applications
- Essential for production

**Next:** Choose your installation method and follow the steps above!

---

**Date:** April 5, 2026  
**Status:** Configured and ready ✓  
**Framework:** Laravel 10 + Redis
