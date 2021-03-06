import React from 'react';
import PropTypes from 'prop-types';
import DefaultRules from "./DefaultRules";
import DefaultMessages from "./DefaultMessages";
import {Platform, UIManager, View, ViewPropTypes} from "react-native";
import is from 'object.is';


export default class Form extends React.Component {
  static childContextTypes = {
    form: PropTypes.object
  };

  static propTypes = {
    style: ViewPropTypes.style,
    instantValidate: PropTypes.bool,
    initialValues: PropTypes.object
  };

  static defaultProps = {
    instantValidate: true,
    initialValues: {}
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

  componentWillReceiveProps(nextProps) {
    if (!is(nextProps.initialValues, this.props.initialValues)) {
      this.childs
        .filter(child => !!child.props.name)
        .forEach(child => child.setInitialValue(nextProps.initialValues[child.props.name]));
    }
  }

  attachToForm(component) {
    if (this.childs.indexOf(component) === -1) {
      this.childs.push(component);
      if (component.props.name) {
        component.setInitialValue(this.props.initialValues[component.props.name])
      }
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
    return this.childs.every((child) => child.validate());
  }

  getPostObject() {
    return this.childs.reduce(((a, b) => {return {...a, ...b.toObject()}}), {});
  }

  render() {
    return (
      <View {...this.props}>
        {this.props.children}
      </View>
    );
  }
}