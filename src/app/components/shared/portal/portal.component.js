import ReactDOM from 'react-dom';

export const PortalComponent = props => {
  const node = !!props.component ? ReactDOM.findDOMNode(props.component) : props.node;
  return !!node ? ReactDOM.createPortal(props.children, node) : null;
};
