import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, LayoutAnimation } from 'react-native';

export default class FieldBase extends React.Component {
  static contextTypes = {
    form: PropTypes.object,
  };

  static defaultProps = {
    disabled: false,
    errorTextStyle: {}
  };

  static propTypes = {
    disabled: PropTypes.bool,
    errorTextStyle: Text.propTypes.style,
    name: PropTypes.string
  };

  constructor(props, context) {
    super(props, context);
    this._getErrorText = this._getErrorText.bind(this);
    this.validate = this.validate.bind(this);
    this.configure = this.configure.bind(this);
    this.clearError = this.clearError.bind(this);
  }

  state = {
    value: ""
  };

  _getErrorText(){
    if (this.state.errorMessage) {
      return(<Text style={this.props.errorTextStyle}>
        {this.state.errorMessage}
      </Text>);
    }
  }

  clearError() {
    delete this.state.errorMessage;
    this.setState(this.state);
  }

  componentWillMount() {
    this.configure();
  }

  componentWillUnmount() {
    this.context.form.detachFromForm(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.errorMessage !== nextState.errorMessage) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }

  configure() {
    this.context.form.attachToForm(this);
    this.instantValidate = this.context.form.instantValidate;
  }

  setInitialValue(value) {
    this.setState({ value });
  }

  validate() {
    this.clearError();
    const value = this.getValue();
    const rules = this.context.form.rules;
    for (const key of Object.keys(this.props.rules)) {
      const isRuleFn = (typeof rules[key] === "function");
      const isRegExp = (rules[key] instanceof RegExp);
      if ((isRuleFn && !rules[key](this.props.rules[key], value)) || (isRegExp && !rules[key].test(value))) {
        const errorMessage = this.context.form.messages[key].replace("{0}", this.props.rules[key]);
        this.setState({ errorMessage });
        return false;
      }
    }
    return true;
  }

  toObject() {
    if (!this.props.name) {
      return {};
    }
    let obj = {};
    obj[this.props.name] = this.getValue();
    return obj;
  }

  _getInnerComponent() {
    throw "Should be overridden by subclass";
  }

  getValue() {
    throw "Should be overridden by subclass";
  }

  render() {
    return(
      <View>
        {this._getInnerComponent()}
        {this._getErrorText()}
      </View>
    );
  }
}