module.exports = {
    apps : [{
        name: 'book-app',
        script: 'dist/src/server.js',
        production: {
            NODE_ENV: 'production',
            DOTENV_CONFIG_PATH: './.env.prod'
        }
    }]
}