FROM php:8.3-fpm

WORKDIR /var/www

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
        git \
        curl \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libpq-dev \
        libgmp-dev \
        cron \
        procps \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_mysql exif bcmath gmp \
    && docker-php-ext-enable exif bcmath gmp \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Node.js and NPM
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# Set NPM global directory
ENV PATH="/var/www/node_modules/.bin:$PATH"

# Copy application files and set permissions
ADD . /var/www
RUN chown -R www-data:www-data /var/www \
    && chmod -R 777 /var/www/

# PHP configuration
RUN echo "max_execution_time = -1" > $PHP_INI_DIR/conf.d/max-execution-time.ini \
    && echo "memory_limit = -1" > $PHP_INI_DIR/conf.d/memory-limit.ini \
    && echo "upload_max_filesize = 999M" > $PHP_INI_DIR/conf.d/max-file-size.ini \
    && echo "post_max_size = 999M" > $PHP_INI_DIR/conf.d/post-max-size.ini

# Install Composer (latest version) using the official image
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Set Composer environment variables
ENV PATH="/composer/vendor/bin:$PATH" \
    COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_HOME=/composer

# Custom cron job
RUN echo "* * * * * /usr/local/bin/php /var/www/html/cron.php >> /var/log/xml_processing.log 2>&1" > /etc/cron.d/xml-processor-cron \
    && chmod 0644 /etc/cron.d/xml-processor-cron \
    && crontab /etc/cron.d/xml-processor-cron

# Expose PHP-FPM port
EXPOSE 9000

# Start cron and PHP-FPM
CMD service cron start && php-fpm
