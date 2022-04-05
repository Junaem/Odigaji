import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Mypage.css';
import server from '../../API/server';
import { useNavigate } from 'react-router-dom';
import Active from '../../components/Mypage/Acitive';
import VisitedCity from '../../components/Mypage/visitedCity';
import Review from '../../components/Mypage/Review';
import ReviewCommend from '../../components/Mypage/ReviewCommend';
function Mypage() {
  let imageCondition = false;
  const Defaultimg =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
  const [Userdata, setUserData] = useState({ hits: [] });
  const [selCityData, setselCityData] = useState([]);
  const [selCityLength, setselCityLength] = useState(0);
  const [reviewCommentData, setReviewCommentData] = useState([]);
  const [reviewCommentLength, setReviewCommentLength] = useState(0);
  const [reviewData, setReviewData] = useState([]);
  const [reviewLength, setReviewLength] = useState(0);
  const [CityData, setCityData] = useState([]);
  if (Userdata.photo) {
    imageCondition = true;
  }
  const getUserInfo = async () => {
    const jwt = sessionStorage.getItem('jwt');

    await axios
      .get(server.BASE_URL + server.ROUTES.mypage, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getSelCityInfo = async () => {
    const jwt = sessionStorage.getItem('jwt');

    await axios
      .get(server.BASE_URL + server.ROUTES.selCity, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        setselCityLength(response.data.length);
        setselCityData(response.data);
      })
      .catch((error) => {
        console.log(error);
        setselCityData([]);
      });
  };

  const getReviewConmentInfo = async () => {
    const jwt = sessionStorage.getItem('jwt');

    await axios
      .get(server.BASE_URL + server.ROUTES.comment, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        setReviewCommentLength(response.data.length);
        setReviewCommentData(response.data);
      })
      .catch((error) => {
        console.log(error);
        setReviewCommentData([]);
      });
  };

  const getUserReviewInfo = async () => {
    const jwt = sessionStorage.getItem('jwt');
    axios.defaults.headers.common['Authorization'] = jwt ? `Bearer ${jwt}` : '';
    await axios
      .get(server.BASE_URL + server.ROUTES.userReview)
      .then((response) => {
        console.log(response);
        setReviewLength(response.data.data.length);
        setReviewData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        setReviewData([]);
      });
  };
  const getCity = async () => {
    await axios
      .get(server.BASE_URL + server.ROUTES.city)
      .then((response) => {
        console.log(response);
        setCityData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let navigate = useNavigate();

  const InfoClick = () => {
    navigate('/mypage/userinfo', { state: Userdata });
  };

  useEffect(() => {
    getUserInfo();
    getSelCityInfo();
    getReviewConmentInfo();
    getUserReviewInfo();
    getCity();
  }, []);
  console.log(Userdata);
  return (
    <div className="My">
      <div className="TitleContainer">
        <div>
          <div className="profileBox">
            <img
              className="profileImg"
              src={
                imageCondition ? server.BASE_URL + Userdata.photo : Defaultimg
              }
            />
          </div>
        </div>
      </div>
      <div className="userContainer">
        <div className="userbutton">
          <div className="userName">{Userdata.username}</div>
          <button onClick={InfoClick} className="Editinfo">
            회원수정
          </button>
        </div>
        <div className="userNick">{Userdata.nickname}</div>
        <div className="userPoint">포인트 {Userdata.point}</div>
      </div>

      <Active
        selCityLength={selCityLength}
        reviewLength={reviewLength}
        reviewCommentLength={reviewCommentLength}
      ></Active>

      <VisitedCity selCityData={selCityData}></VisitedCity>
      <Review reviewData={reviewData} CityData={CityData}></Review>
      <ReviewCommend reviewCommentData={reviewCommentData}></ReviewCommend>
    </div>
  );
}
export default Mypage;
