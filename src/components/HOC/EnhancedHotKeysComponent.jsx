import React from "react";
import {HotKeys} from "react-hotkeys";

const EnhancedHotKeysComponent = (WrappedComponent) => {
    class NewComponent extends React.Component {
        constructor(props) {
            super(props);

            this.state={
                debugMode: false
            }

            this.keyMap = {
                debugKey:"ctrl+alt+d"
            };

            this.handlers = {
                debugKey: (e) => {
                    console.log("Debug Mode: " + this.state.debugMode)
                    this.setState(prevState => {
                        return {
                            debugMode: !prevState.debugMode
                        }
                    });
                }
            }
        }

        render() {
            const {forwardedRef, debugMode, ...rest} = this.props;

            return (
                <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
                    <WrappedComponent
                        ref={forwardedRef}
                        {...rest}
                        debugMode={this.state.debugMode}
                    />
                </HotKeys>
            )
        }
    } return(
        React.forwardRef((props, ref) => {
            return(
                <NewComponent {...props} forwardedRef={ref} />
            )
        })
    );
}

export default EnhancedHotKeysComponent;