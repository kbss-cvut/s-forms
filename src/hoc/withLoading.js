import * as React from 'react';
import Mask from '../components/Mask';
import getDisplayName from '../util/getDisplayName';
import classNames from 'classnames';



/**
 * Generic loading mask displaying HOC, which can be used to wrap arbitrary components expected to receive loading
 * property.
 * @param Component The component to wrap
 * @param options Configuration for the generated wrapper
 * @constructor
 */
const withLoading = function (Component, options) {
    const Wrapped = function (options) {
        const tag = options.tag ? options.tag : 'div';
        const className = classNames(options.containerClass, 'relative');

        return React.createElement(tag, {className},
            loading && <Mask text={loadingMsg} classes={options.maskClass}/>,
            <Component {...props}/>
        );
    };
    Wrapped.displayName = "LoadingWrapper(" + getDisplayName(Component) + ")";
    return Wrapped;
};

export default withLoading;