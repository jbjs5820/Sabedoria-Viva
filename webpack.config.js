const webpack = require('@nativescript/webpack');

module.exports = (env) => {
    webpack.init(env);
    
    // Add any custom configurations here
    webpack.mergeConfig(env, {
        resolve: {
            fallback: {
                "stream": false,
                "crypto": false
            }
        }
    });
    
    return webpack.resolveConfig();
};