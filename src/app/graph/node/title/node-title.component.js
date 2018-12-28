import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPauseCircle, faWrench } from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'rc-tooltip';

import { NODE_TYPES, MACHINE_STATE } from '../../dictionary';

import styles from './node-title.module.scss';

export class NodeTitleComponent extends Component {
  render() {
    const { label, state, className, process = {}, type, busy } = this.props;

    return (
      <div className={className}>
        {label}
        {(() => {
          if (!process.setup && NODE_TYPES.step === type) {
            return (
              <Tooltip placement="bottom" overlay="Setup node settings" overlayClassName="tooltip">
                <div className={styles.pulse}>
                  <FontAwesomeIcon icon={faWrench} />
                </div>
              </Tooltip>
            );
          }

          switch (state) {
            case MACHINE_STATE.cold:
              return `❄`;
            case MACHINE_STATE.preparing:
              return (
                <Tooltip placement="bottom" overlay="Node is warming up" overlayClassName="tooltip">
                  <FontAwesomeIcon icon={faSpinner} spin size="1x" />
                </Tooltip>
              );
            case MACHINE_STATE.ready:
              return (
                <Tooltip placement="bottom" overlay="Node is ready" overlayClassName="tooltip">
                  <span>✓</span>
                </Tooltip>
              );
            default:
              return null;
          }
        })()}
        {NODE_TYPES.step === type &&
          busy.map((state, index) => (
            <span key={index}>
              {state ? (
                <>
                  [<FontAwesomeIcon icon={faSpinner} spin size="1x" />]
                </>
              ) : (
                <>
                  [<FontAwesomeIcon icon={faPauseCircle} size="1x" />]
                </>
              )}
            </span>
          ))}
      </div>
    );
  }
}
