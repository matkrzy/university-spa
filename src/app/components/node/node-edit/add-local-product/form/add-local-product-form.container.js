import { connect } from 'react-redux';

import { AddLocalProductFormComponent } from './add-local-product-form.component';
import { marketAddGoods } from 'app/socket/market/actions';

const mapStateToProps = ({
  process: {
    data: { id: processId },
  },
}) => ({
  initialValues: {
    processId,
  },
});

const mapDistpatchToProps = (dispatch, { toggle }) => ({
  onSubmit: values => {
    marketAddGoods({
      payload: values,
      callback: toggle,
    });
  },
});

export const AddLocalProductFormContainer = connect(
  mapStateToProps,
  mapDistpatchToProps,
)(AddLocalProductFormComponent);
