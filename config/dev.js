module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {},
  mini: {
    // 通过webpackChain配置解决开发环境下小程序包体积过大无法进行预览上传的问题
    webpackChain: chain => {
      chain.merge({
        plugin: {
          install: {
            plugin: require('terser-webpack-plugin'),
            args: [
              {
                terserOptions: {
                  compress: true, // 默认使用terser压缩
                  // mangle: false,
                  keep_classnames: true, // 不改变class名称
                  keep_fnames: true // 不改变函数名称
                }
              }
            ]
          }
        }
      });
    }
  },
  h5: {}
};
