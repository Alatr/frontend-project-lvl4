import Add from './AddChannel.jsx';
import Remove from './RemoveChannel.jsx';
import Rename from './RenameChannel.jsx';

const modals = {
  adding: Add,
  removing: Remove,
  renaming: Rename,
};

export default (modalName) => modals[modalName];
