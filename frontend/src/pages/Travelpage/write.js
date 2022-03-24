// import { Row, Table, Col, Button } from 'react-bootstrap';
import { React, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './write.css';
function Write() {
  const [reviewContent, setReviewContent] = useState({
    // 입력한 내용 userState에 저장하기위한 변수
    title: '',
    content: '',
  });

  // 입력내용 누르면 저장 시키는 변수 현재는 화면 위에 띄어주기만함,,
  const [viewContent, setViewContent] = useState([]);

  const getValue = (e) => {
    const { name, value } = e.target;
    setReviewContent({
      ...reviewContent,
      [name]: value,
    });
    console.log(reviewContent);
  };

  return (
    <div className="Write">
      <h1>관광지 리뷰</h1>
      <div className="review-container">
        {viewContent.map((element) => (
          <div>
            <h2>{element.title}</h2>
            <div>{element.content}</div>
          </div>
        ))}
      </div>
      <div className="form-wrapper">
        <input
          className="title-input"
          type="text"
          placeholder="제목"
          onChange={getValue}
          name="title"
        />
        <CKEditor
          editor={ClassicEditor}
          data="<p>Hello from CKEditor 5!</p>"
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log('Editor is ready to use!', editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
            setReviewContent({
              ...reviewContent,
              content: data,
            });
            console.log(reviewContent);
          }}
          onBlur={(event, editor) => {
            console.log('Blur.', editor);
          }}
          onFocus={(event, editor) => {
            console.log('Focus.', editor);
          }}
        />
      </div>
      <button
        className="submit-button"
        onClick={() => {
          setViewContent(viewContent.concat({ ...reviewContent }));
        }}
      >
        입력
      </button>
    </div>
  );
}
export default Write;