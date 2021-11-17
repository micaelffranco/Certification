import React from 'react';

import '../App.css';

const CreateCertificateForm = (props) => {

  const titleChangeHandler = (event) => {
    props.onSetTitle(event.target.value);
  };

  const artistChangeHandler = (event) => {
    props.onSetArtist(event.target.value);
  };

  const yearChangeHandler = (event) => {
    props.onSetYear(event.target.value);
  };

  const imageChangeHandler = (event) => {
    props.onSetImage(event);
  };

  return (
    <div className="DivRow">
      <label> Title:
        <input name="Title" type="text" value={props.title}
          onChange={titleChangeHandler} />
      </label>
      <label> Artist:
        <input name="numberOfGuests" type="text" value={props.artist}
          onChange={artistChangeHandler} />
      </label>
      <label> Year:
        <input name="Year" type="text" value={props.year}
          onChange={yearChangeHandler} />
      </label>
      <label> Image:
        <input
          name="Photoipfs" type="file" onChange={imageChangeHandler}/>
      </label>
      </div>
  );
};

export default CreateCertificateForm;
