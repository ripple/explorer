const path = require('path')

// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/en/webpack.html

module.exports = {
  process(_src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename))

    return `const React = require('react');
      module.exports = React.forwardRef((props, ref) => {
        return {
          $$typeof: Symbol.for('react.element'),
          type: 'svg',
          ref: ref,
          key: null,
          props: Object.assign({}, props, {
            children: ${assetFilename}
          })
        };
      });`
  },
}
