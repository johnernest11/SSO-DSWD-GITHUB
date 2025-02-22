## About WebAppKit API

WebAppKit API is a Laravel 10 RESTFul starter kit for SPA and mobile clients. This kit includes the following features:
- Implementation of a Token-based Authentication with [Sanctum](https://laravel.com/docs/9.x/sanctum) and [JWT](https://github.com/stechstudio/laravel-jwt)
- Implementation of Role-based Access Control with [Spatie](https://spatie.be/docs/laravel-permission/v5/introduction)
- Implementation of CRUD for user profile with profile picture upload
- Implementation Forgot and Reset Password with Email Notification
- International phone number validation support
- Implementation of S3 upload with pre-signed URL
- System Alert notifications for critical errors/warnings (Email & Slack)
- Pipeline implementation of HTTP query filters
- Implementation of search functionality with DB fulltext indexes
- Sample webhooks available with API Key authentication and permission-based authorization
- AWS SQS integration for user notifications (emails, slack alerts). Comes with Redis queueing pre-configured
- Composer and Git hook automation with GrumpPhp
- Modular implementation of Multi-factor Authentication with Email OTP and Google Authenticator
- [Clockwork](https://github.com/itsgoingd/clockwork) installed for performance monitoring while in development. Remember to install the browser extension
- Gitlab MR template in `.gitlab/merge_request_templates`
- Feature and Unit tests coverage

## Set up your local development environment
- Minimum of PHP 8.2 installed with a database engine that supports JSON types and possibly with full text search (e.g. MySQL8, MariaDB 10.5)
- Create a **.env** and a **.env.testing** files from the **.env.example** that came with this project. For security purposes, please request the contents of these files from the SCRUM master / Tech Lead
  - Multi-Auth Update: Make sure that `SANCTUM_AUTH_ENABLED`, `JWT_AUTH_ENABLED`, `WEBHOOKS_ENABLED` are set to true in `.env.testing`
- Locate your **php.ini** file and change the value **upload_max_filesize** to **10M**. See this [guide](https://devanswers.co/ubuntu-php-php-ini-configuration-file/) if you're having trouble finding the directory of your php.ini file
- Make sure you have MySQL and Redis running locally (or depending on what's stated in the **.env** file)
- Run the command `composer install`  to install all the project and dev dependencies
- Run the command `php artisan app:init` to initialize the project. The command will run:
  - App key generation
  - DB migrations
  - DB Seeders
- To check if everything is working as expected, run: `php artisan test`

## Tools ready for you
Runs a [code styler](https://laravel.com/docs/9.x/pint) for consistency and generate [IDE helper PHP Docs](https://github.com/barryvdh/laravel-ide-helper). See the command at `app/Console/Commands/StyleFixer.php`
```
php artisan app:styler -i
```
\
Create a user with role. See the command at `app/Console/Commands/CreateUser.php`
```
php artisan user:create
```
\
Create an API Key for Webhook integration. See the command at `app/Console/Commands/CreateApiKey.php`
```
php artisan api_key:create
```
\
Setup MFA configurations. See command at `app/Console/Commands/SetupMfa.php`
```
php artisan mfa:setup
```
\
Delete expired MFA attempt records in the database (is also scheduled to run every 12AM). See command at `app/Console/Commands/PurgeExpiredMfaAttempts.php`
```
php artisan mfa:prune-expired-attempts
```
\
Running `git commit` will trigger automated tasks specified in `grumphp.yml`
- PSR-compliant code formatting
- Package security checks
- Unit and feature tests

## Serve the API locally
- Terminal 1: Run `php artisan serve`
- Terminal 2: Run `php artisan queue:work --queue=otp,emails,dev_alerts,default`

## Style Guide Ver. 0.2
- Use **FormRequest** validators when available
- Favor single quotes over double quotes
- Make use of type-hinting
- Extend the **ApiController** for all your API controllers
- Use `snake_case` for DB table columns, request inputs, and resource views
- Use `PascalCase` for class names
- User `camelCase` for variable, method, and function names
- Create separate API route files per resource/feature. Load all of them in `routes/api.php`
- Follow and implement the [PHPDoc](https://docs.phpdoc.org/3.0/guide/guides/docblocks.html) style guide
- Use `app\Exceptions\Handler.php` for centralized error handling
- Stick with Eloquent as much as possible, create services to abstract or remove duplicating code
- We use the `tests/Feature` specifically for API endpoint tests, and `tests/Unit` for unit and integration tests

## Note
- The default timezone set for dates and timestamps is `Asia/Manila`. You can change this in `config/app.php`
- Extend the Database\Seeders\CiCdCompliantSeeder class when making a seeder that will be called in database/seeders/DatabaseSeeder.php

## Authors
- Jego Carlo Ramos
- John Paul Gulayan
