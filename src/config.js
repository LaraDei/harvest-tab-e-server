module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_ORIGIN: '/\.localhost:3000$/' || '/\.harvest-table.vercel.app$/',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://bluth@localhost/harvesttable',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://bluth@localhost/harvesttable_test',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '1h'
}