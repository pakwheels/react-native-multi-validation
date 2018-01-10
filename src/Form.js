import React from 'react';
import PropTypes from 'prop-types';
import DefaultRules from "./DefaultRules";
import DefaultMessages from "./DefaultMessages";
import {Platform, UIManager, View} from "react-native";

export default class Form extends React.Component {
  static childContextTypes = {
    form: PropTypes.object
  };

  static propTypes = {
    style: View.propTypes.style,
    instantValidate: PropTypes.bool,
  };

  static defaultProps = {
    instantValidate: true,
  };

  constructor(props, context) {
    super(props, context);
    this.attachToForm = this.attachToForm.bind(this);
    this.detachFromForm = this.detachFromForm.bind(this);
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentWillMount() {
    this.childs = [];
  }

  getChildContext() {
    return {
      form: {
        attachToForm: this.attachToForm,
        detachFromForm: this.detachFromForm,
        instantValidate: this.props.instantValidate,
        rules: this.props.rules || DefaultRules,
        messages: this.props.messages || DefaultMessages.en
      }
    };
  }

  attachToForm(component) {
    if (this.childs.indexOf(component) === -1) {
      this.childs.push(component);
    }
  }

  detachFromForm(component) {
    const componentPos = this.childs.indexOf(component);
    if (componentPos !== -1) {
      this.childs = this.childs.slice(0, componentPos)
        .concat(this.childs.slice(componentPos + 1));
    }
  }

  validate() {

  }

  render() {
    return (
      <View {...this.props}>
        {this.props.children}
      </View>
    );
  }
}