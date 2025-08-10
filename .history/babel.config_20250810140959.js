module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            root: ['./'],
            alias: {
              '@': './',              // corespunde "@/*": ["./*"]
              navigation: './navigation'
            },
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
          }
        ]
      ]
    };
  };