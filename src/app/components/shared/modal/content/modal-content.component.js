import { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

export const ModalContentComponent = onClickOutside(
  class extends Component {
    componentDidMount() {
      document.addEventListener('keyup', this.handleKeyPress);
    }

    componentWillUnmount() {
      document.removeEventListener('keyup', this.handleKeyPress);
    }

    handleKeyPress = e => {
      switch (e.key) {
        case 'Escape': {
          return this.handleClickOutside(e);
        }
        default:
          return false;
      }
    };

    render() {
      return this.props.children;
    }
  },
);
