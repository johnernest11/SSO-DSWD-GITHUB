<?php

namespace App\Models;

use App\Notifications\Auth\QueuedResetPasswordNotification;
use App\Notifications\Auth\QueuedVerifyEmailNotification;
use App\Notifications\Auth\VerifyAccountNotification;
use App\Notifications\EmailOtpNotification;
use App\QueryFilters\Generic\ActiveFilter;
use App\QueryFilters\Generic\SortFilter;
use App\QueryFilters\User\EmailFilter;
use App\QueryFilters\User\RoleFilter;
use App\QueryFilters\User\VerifiedFilter;
use DateTimeHelper;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements CanResetPassword, MustVerifyEmail
{
    use HasApiTokens;
    use HasFactory;
    use HasRoles;
    use Notifiable;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'password',
        'active',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be eager-loaded
     *
     * @var array<int, string>
     */
    protected $with = [
        'roles:id,name',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'active' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::deleting(function (User $user) {
            /**
             * Modify the unique email before deleting so that it can be reused
             * Ex: test_email@gmail.com -> test_email@gmail.com::deleted_<timestamp>
             */
            $user->email = DateTimeHelper::appendTimestamp($user->email, '::deleted_');
            $user->saveQuietly();

            // Delete the UserProfile and Api Keys associated with this user
            $user->userProfile()->delete();
            $user->apiKeys()->delete();
        });
    }

    /**
     * @Scope
     * Pipeline for HTTP query filters
     */
    public function scopeFiltered(Builder $builder): Builder
    {
        return app(Pipeline::class)
            ->send($builder->with('userProfile'))
            ->through([
                ActiveFilter::class,
                SortFilter::class,
                EmailFilter::class,
                VerifiedFilter::class,
                RoleFilter::class,
            ])
            ->thenReturn();
    }

    /**
     * A User has exactly one profile information
     */
    public function userProfile(): HasOne
    {
        return $this->hasOne(UserProfile::class);
    }

    /**
     * A user can own many API Keys
     */
    public function apiKeys(): HasMany
    {
        return $this->hasMany(ApiKey::class);
    }

    /**
     * A User has many MFA Credentials (to support different MFA Methods)
     */
    public function verificationFactors(): HasMany
    {
        return $this->hasMany(VerificationFactor::class);
    }

    /**
     * A user has many MFA attempts (to support concurrent log-ins)
     */
    public function mfaAttempts(): HasMany
    {
        return $this->hasMany(MfaAttempt::class);
    }

    /**
     * @Attribute
     * Hash the password whenever it is changed
     */
    protected function password(): Attribute
    {
        return Attribute::set(
            fn ($value) => is_null($value) ? null : Hash::make($value)
        );
    }

    /**
     * @Attribute
     * Set email to lowercase.
     */
    protected function email(): Attribute
    {
        return Attribute::set(
            fn ($value) => strtolower($value)
        );
    }

    /*
     * Override default email verification notification
     */
    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new QueuedVerifyEmailNotification($this));
    }

    /**
     * Send account verification notification
     */
    public function sendAccountVerificationNotification(string $temporaryPassword): void
    {
        $this->notify(new VerifyAccountNotification($this, $temporaryPassword));
    }

    /*
     * Override default password reset notification
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new QueuedResetPasswordNotification($token));
    }

    public function sendEmailOtpNotification(string $otp, int $expirationInMinutes): void
    {
        $this->notify(new EmailOtpNotification($otp, $expirationInMinutes));
    }
}
