# Configuration Guide

## File Structure

- **`application.properties`**: Template configuration (committed to git)
- **`application-local.properties`**: Your local configuration (ignored by git)

## How to Use

### Development (Local)

Run the application with local profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Or set in IDE:
- **IntelliJ IDEA**: Run Configuration → Environment Variables → `spring.profiles.active=local`
- **VS Code**: Add to `launch.json`: `"args": "--spring.profiles.active=local"`

### Production

Use environment variables instead of properties files:

```bash
export DB_USERNAME=your_db_user
export DB_PASSWORD=your_secure_password
export JWT_SECRET=your_production_jwt_secret
export JWT_EXPIRATION=86400000

mvn spring-boot:run
```

## Security Notes

⚠️ **NEVER commit `application-local.properties`** - it contains sensitive data!

✅ Always use:
- `application-local.properties` for local development
- Environment variables for production
- Strong, unique JWT secrets for production (minimum 256-bit)
