module.exports = {
    "extends": "airbnb",
    "rules": {
        // windows linebreaks when not in production environment
        "linebreak-style": ["error", "windows"],
        "no-underscore-dangle": [2, { "allow": ['_id'] }]
    }
};