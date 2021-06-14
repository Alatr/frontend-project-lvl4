import React from 'react';
import classNames from 'classnames';

const ChannelsList = ({ channels, currentChannelId }) => (
  <ul className="nav flex-column nav-pills nav-fill">
    {channels.map(({ name, id }, i) => (
      <li className="nav-item" key={id}>
        <button
          type="button"
          className={classNames('w-100', 'px-4', 'rounded-0', 'text-start', 'btn', {
            'btn-secondary': i !== currentChannelId,
          })}
        >
          <span className="me-3">#</span>
          {name}
        </button>
      </li>
    ))}
  </ul>
);

export default ChannelsList;
