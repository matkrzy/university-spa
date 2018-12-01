import { connect } from 'react-redux';

import { NotificationsComponent } from './notifications.component';

import { notificationsTake } from 'app/redux/notifications/notifications.actions';

const mapStateToProps = ({ notifications }) => ({ ...notifications });

const mapDispatchToProps = {
  notificationsTake,
};

export const NotificationsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationsComponent);
