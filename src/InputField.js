import React from 'react';
import PropTypes from 'prop-types';
import {TextInput, LayoutAnimation} from 'react-native';
import FieldBase from "./FieldBase";

export default class InputField extends FieldBase {
  constructor(props, context) {
    super(props, context);
    this._setValue = this._setValue.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onFocus = this._onFocus.bind(this);
  }

  static propTypes = {
    ...FieldBase.propTypes,
    rules: PropTypes.object,
    style: TextInput.propTypes.style,
    passStyle: TextInput.propTypes.style,
    failStyle: TextInput.propTypes.style,
    focusStyle: TextInput.propTypes.style,
  };

  static defaultProps = {
    disabled: false,
    rules: {},
    style: {},
    passStyle: {},
    failStyle: {},
    focusStyle: {}
  };

  componentWillMount() {
    super.componentWillMount();
    this.state.value = this.props.value;
  }

  componentWillUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  getValue() {
    return this.state.value || "";
  }

  _setValue(value) {
    this.state.value = value;
    if (this.context.form.instantValidate){
      this.validate();
    }else {
      this.clearError();
    }
    this.props.onChangeText && this.props.onChangeText(value);
  }

  focus() {
    this.refs._textInput.focus();
  }

  _onBlur() {
    this.state.inFocus = false;
    this.validate();
    this.props.onBlur && this.props.onBlur();
  }

  _onFocus() {
    this.setState({inFocus: true});
    this.props.onFocus && this.props.onFocus();
  }

  get style() {
    const {style, passStyle, failStyle, focusStyle} = this.props;
    if (this.state.errorMessage) {
      return [style, failStyle];
    }
    if (this.state.inFocus) {
      return [style, focusStyle];
    }
    if (this.getValue().length === 0) {
      return style;
    }
    return [style, passStyle];
  }

  _getInnerComponent() {
    return (
      <TextInput
        {...this.props}
        style={this.style}
        ref={"_textInput"}
        onChangeText={this._setValue}
        editable={!this.props.disabled}
        onBlur={this._onBlur}
        onFocus={this._onFocus}
      />
    )
  }
}