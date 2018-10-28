import React, { Component } from 'react';

import styles from './node-sidebar-details.module.scss';

export class NodeSidebarDerails extends Component {
  onPortHover = id => {
    const node = document.getElementById(id);
    if (node) {
      const parent = node.parentNode;
      parent.classList.add('port-hovered-from-sidebar');
      console.log(parent);
    }
  };

  resetPortClasses = () => {
    const node = document.querySelector('.port-hovered-from-sidebar');
    if (node) {
      node.classList.remove('port-hovered-from-sidebar');
    }
  };

  renderPortInfo = portType => {
    const ports = this.props[portType] || [];

    return (
      <div className="sidebar__section ">
        <div className="section__title">{portType}</div>
        <div className="section__body">
          {ports.map(({ label, connections, maxConnections, id }, index) => (
            <div
              className={styles.port}
              key={index}
              onMouseEnter={() => this.onPortHover(id)}
              onMouseLeave={this.resetPortClasses}
            >
              <div className={styles.portLabel}>
                <strong>{label}</strong>
              </div>
              <div>connections: {`${connections}/${maxConnections}`}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  render() {
    return (
      <>
        <div className={styles.sectionTitle}>Node details</div>
        {this.renderPortInfo('inputs')}
        {this.renderPortInfo('outputs')}
        <div className={styles.sectionTitle}>Process details</div>
      </>
    );
  }
}
