import React from 'react';
import Dropzone from 'react-dropzone';

const videoStyle = {
  'width': '600px',
  'height': '600px',
};

export default React.createClass({
  
  // upload params: file dragged into dropzone
  // sends filename to server to get signed url, then uploads the file to AWS
  upload(files) {
    var file = files[0];

    fetch('http://localhost:3000/api/s3', {
      method: 'POST',
      body: JSON.stringify({
        'filename': file.name,
        'filetype': file.type
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((data) => {
      // need to get json of response
      return data.json();
    })
    .then((signedUrl) => {

      return fetch(signedUrl, {
          method: 'PUT',
          body: file
        });
    })
    .then((data) => {
      console.log('we got data', data);
      return data.json();
    })
    .then((awsUrl) => {
      console.log('response is', awsUrl);
    })
    .catch((err) => {
      console.log('error uploading', err);
    });
  },

  render() {
    return (
      <div>
        <div>
          This is the upload subpage
        </div>
        <Dropzone onDrop={ this.upload } size={ 150 }>
          <div>
            Drop some files here!
          </div>
        </Dropzone>
        <video autoPlay='true' src="https://s3-us-west-1.amazonaws.com/invalidmemories/test.mp4" style={videoStyle}/>
      </div>
      );
  }
});
