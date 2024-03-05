module.exports = {
    apps : [{
        name: 'book-app',
        script: 'dist/src/server.js',
        production: {
            NODE_ENV: 'production',
            dotenv_config_path: './.env.prod'
        }
    }]
}