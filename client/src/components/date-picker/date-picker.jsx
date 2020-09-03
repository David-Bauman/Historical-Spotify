import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import 'react-dates/initialize';
import {SingleDatePicker as SingleDatePickerAir} from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './date-picker.css';

export class SingleDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.date ? moment(this.props.date) : null,
      focused: false,
    };
    this.changeDate = this.changeDate.bind(this);
    this.changeFocus = this.changeFocus.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
  }

  changeDate(momentObj) {
    this.setState({date: momentObj});
    this.props.onDateChange(momentObj);
  }

  changeFocus(truthiness) {
    this.setState({focused: truthiness});
    this.props.onFocus(truthiness);
  }

  handleBlock(momentObj) {
    const possibles = this.props.possibleDates;
    for (let i = 0; i < possibles.length; i++) {
      if (momentObj.isSame(possibles[i], 'day'))
        return false;
    }
    return true;
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.date && props.date) {
      return Object.assign(state, {date: props.date})
    }
    return null;
  }

  render() {
    return (
      <SingleDatePickerAir
        date={this.state.date}
        focused={this.state.focused}
        hideKeyboardShortcutsPanel
        id='historical-date-picker'
        isOutsideRange={this.handleBlock}
        numberOfMonths={1}
        onDateChange={this.changeDate}
        onFocusChange={e => this.changeFocus(e.focused)}
      />
    )
  }
}

SingleDatePicker.defaultProps = {
  onDateChange: momentObj => {},
  onFocus: truthiness => {},
};

SingleDatePicker.propTypes = {
  onDateChange: PropTypes.func,
  onFocus: PropTypes.func,
  possibleDates: PropTypes.array.isRequired,
};
