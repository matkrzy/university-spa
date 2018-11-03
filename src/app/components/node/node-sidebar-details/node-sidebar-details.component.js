import React, { Component } from 'react';

import styles from './node-sidebar-details.module.scss';

/** Class representing a node sidebar details
 * @extends Component
 */
export class NodeSidebarDerails extends Component {
  /**
   * Handler for hover on port label. It highlights port in node by adding class to it
   * @param {string} id - id of node port
   */
  onPortHover = id => {
    const node = document.getElementById(id);
    if (node) {
      const parent = node.parentNode;
      parent.classList.add('port-hovered-from-sidebar');
    }
  };

  /**
   * Handler for reset classes when mouse leave port label
   */
  resetPortClasses = () => {
    const node = document.querySelector('.port-hovered-from-sidebar');
    if (node) {
      node.classList.remove('port-hovered-from-sidebar');
    }
  };

  /**
   * Helper for render port info. It will create section for port
   */
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
        <div className="sidebar__section ">
          <div className="section__body">
            <div>
              <strong>Process time: </strong>
              {this.props.process.duration || '00:00'}
              (h)
            </div>
            <div>
              <strong>Setup time: </strong>
              {this.props.process.setup || '00:00'}
              (h)
            </div>
          </div>
        </div>
      </>
    );
  }
}
