import React, { Component } from 'react';
import { faSpinner, faPauseCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NODE_TYPES, MACHINE_STATE } from 'app/graph-lib/dictionary';

export class NodeTitleComponent extends Component {
  render() {
    const { title, state, className, process, type, busy } = this.props;

    return (
      <div className={className}>
        {title}
        {(() => {
          if (!process.setup && NODE_TYPES.step === type) {
            return '(fix config!)';
          }

          switch (state) {
            case MACHINE_STATE.cold:
              return `❄`;
            case MACHINE_STATE.preparing:
              return <FontAwesomeIcon icon={faSpinner} spin size="1x" />;
            case MACHINE_STATE.ready:
              return `✓`;
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
