import { Container, Image, Row, Table, Col, Button } from 'react-bootstrap';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import server from '../../API/server';
import { Link, useParams } from 'react-router-dom';
import TravelRating from '../../components/Travelcomponents/TravelRating';
import './Local.css';

function MovetravelPage(id) {
  window.location.href = 'travelDetail/' + id + '/';
}

function MoveBoardPage(id) {
  window.location.href = 'travelDetail/board/' + id + '/';
}

// function visited() {
//   console.log('visited button clicked');
//   const jwt = sessionStorage.getItem('jwt');
//   axios.defaults.headers.common['Authorization'] = jwt ? `Bearer ${jwt}` : '';

//   axios
//     .post(server.BASE_URL + server.ROUTES.selCity, {
//       city: cityId,
//       rate: 5,
//     })
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((err) => {
//       console.log(err);
//     });

//   // 나중에 방문처리 할것!!!
//   // axios.get();
// }
let cityId;
function Local() {
  let params = useParams();
  cityId = params.cityId; // 시 아이디를 url에서 받아옴
  const [id, setId] = useState(null); //시 아이디
  const [info, setInfo] = useState(null); // 시 정보
  const [name, setName] = useState(null); // 시 명
  const [papulation, setPapulation] = useState(null); // 시 인구
  const [province, setProvince] = useState(null); // 도 명
  const [area, setArea] = useState(null); // 시 넓이
  const [travelList, setTravelList] = useState(null); // 시 내 관광지목록
  const [localLogo, setLocalLogo] = useState(null); // 시 로고 이미지
  const [avg_rate, setAvg_rate] = useState(null);
  const [rating, setRating] = useState(null);

  //////////////////// URL //////////////////////////////////////
  const cityUrl =
    server.BASE_URL + server.ROUTES.allCities + cityId + '/' + 'get-city/';
  const visitedUrl =
    server.BASE_URL + server.ROUTES.allCities + cityId + '/is-visited/';
  let isLogin = sessionStorage.getItem('jwt');
  useEffect(() => {
    //렌더링 이후에 실행되는 함수

    //로그인 정보 주입!!!
    isLogin = sessionStorage.getItem('jwt');

    const jwt = sessionStorage.getItem('jwt');
    axios.defaults.headers.common['Authorization'] = jwt ? `Bearer ${jwt}` : '';
    //도시정보 가져오기!!!
    axios.get(cityUrl).then((res) => {
      console.log(res);
      setId(res.data.id);
      setInfo(res.data.info);
      setPapulation(res.data.population);
      setName(res.data.name);
      setProvince(res.data.province);
      setArea(res.data.area);
      setTravelList(res.data.att_data);
      setLocalLogo(res.data.photo);
      setAvg_rate(res.data.avg_rate);
      console.log(server.BASE_URL + localLogo);
    });
    //내 별점 가져오기
    axios
      .get(visitedUrl)
      .then((res) => {
        console.log(res);
        setRating(res.data.rate);
        if (res.status === 200) {
          isLogin = true;
        }
      })
      .catch((err) => {
        console.log(err);
        isLogin = false;
      });
    console.log(isLogin);
  }, [isLogin]);
  return (
    <div className="TravelDetail m-5 pt-5 container">
      <div className="card col-sm-4 mt-5">
        <img
          className="card-img-top"
          src={server.BASE_URL + localLogo}
          alt="Card image"
        />
        <div className="card-body">
          <h2 className="card-title">{name}</h2>
          <h5 className="card-text">{info}</h5>
          <div className="bg-info">
            평균별점
            <TravelRating
              cityId={cityId}
              rating={avg_rate}
              setRating={setRating}
            />
          </div>
          <div>인구수 : {papulation}</div>
          <div>면적 : {area}</div>
          <div className="bg-info">
            {isLogin != null ? (
              <TravelRating
                cityId={cityId}
                rating={rating}
                setRating={setRating}
              />
            ) : null}
          </div>
          <Button
            className="reviewButton"
            variant="primary"
            onClick={() => MoveBoardPage(params.cityId)}
          >
            리뷰 게시판 이동
          </Button>{' '}
        </div>
        {/* end card */}
      </div>
      <div className="col-sm-6 tablediv mt-5 pt-5">
        <Table striped bordered hover>
          <thead className="bg-info">
            <th>
              <h5>{name}여행지목록</h5>
            </th>
          </thead>
          <tbody>
            {/* &&양옆에 2개쓰면  */}
            {travelList &&
              travelList.map((data, idx) => {
                return (
                  //무명함수 호출안하면 강제로 이동한다....
                  <tr key={idx} onClick={() => MovetravelPage(data.id)}>
                    <td className="m-2">{data.name}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>

      {/* 로그인여부에따라 별점 평가 기능 활성/ 비활성화 */}
    </div>

    // end TravelDetail Div
  );
}

export default Local;
