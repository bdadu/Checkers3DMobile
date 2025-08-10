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
            navigation: './navigation',
              '@app': './app',
              '@pages': './pages',
              '@components': './components',
            },
            extensions: ['.ts', '.tsx', '.js', '.json'],
          },
        ],
      ],
    };
  };