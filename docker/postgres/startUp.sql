SELECT 'CREATE DATABASE nestjs'
WHERE NOT EXISTS (
        SELECT
        FROM pg_database
        WHERE datname = 'nestjs'
    ) \ gexec CREATE TABLE IF NOT EXISTS users (
        UserId SERIAL PRIMARY KEY NOT NULL,
        FirstName VARCHAR(200) NULL,
        LastName VARCHAR(200) NULL,
        Email VARCHAR(200) NOT NULL,
        Password VARCHAR(200) NOT NULL,
        RefreshToken VARCHAR(1000) NULL,
        RefreshTokenExp DATE NULL
    );