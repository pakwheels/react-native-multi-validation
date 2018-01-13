import React from 'react';
import PropTypes from 'prop-types';
import {Text, View, TouchableOpacity, LayoutAnimation} from "react-native";
import FieldBase from "./FieldBase";

export default class SelectionField extends FieldBase {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    ...FieldBase.propTypes,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onPress: PropTypes.func.isRequired,
    style: View.propTypes.style,
    passStyle: View.propTypes.style,
    failStyle: View.propTypes.style,
    textStyle: Text.propTypes.style
  };

  state = {
    value: this.props.value
  };

  componentWillUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  componentWillReceiveProps(nextProps) {
    this.state.value = nextProps.value;
    this.validate();
  }

  validate() {
    if (this.state.value) {
      return true;
    }
    this.setState({errorMessage: "This field is required"});
  }

  get style() {
    const {style, passStyle, failStyle} = this.props;
    if (this.state.errorMessage) {
      return [style, failStyle];
    }
    if (this.state.value) {
      return [style, passStyle];
    }
    return style;
  }

  _getInnerComponent() {
    return (
      <TouchableOpacity
        style={this.style}
        onPress={this.props.onPress}>
        <Text style={this.props.textStyle}>
          {this.state.value ? this.state.value : this.props.placeholder}
        </Text>
      </TouchableOpacity>
    );
  }
}