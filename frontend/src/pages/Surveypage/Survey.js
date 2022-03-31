import React, { useEffect, useState } from 'react';
import './Survey.css';
import Intro from '../../components/Surveypage/Intro';
import Question from '../../components/Surveypage/Question';
import TourList from '../../components/Surveypage/TourList';
import {
  AllCitiesList,
  AddTaste,
} from '../../components/Surveypage/SurveyAxios';
import axios from 'axios';

function Survey() {
  const surveyData = [
    [
      { title: 'seasons', id: 1, name: '봄', img: 'img/spring.jpg' },
      { title: 'seasons', id: 2, name: '여름', img: 'img/summer.jpg' },
      { title: 'seasons', id: 3, name: '가을', img: 'img/autumn.jpg' },
      { title: 'seasons', id: 4, name: '겨울', img: 'img/winter.jpg' },
    ],
    [
      { title: 'mnt_sea', id: 5, name: '산', img: 'img/mountain.jpg' },
      { title: 'mnt_sea', id: 6, name: '바다', img: 'img/sea.jpg' },
    ],
    [
      { title: 'urb_rur', id: 7, name: '도시', img: 'img/city.jpg' },
      { title: 'urb_rur', id: 8, name: '시골', img: 'img/country.jpg' },
    ],
    [
      { title: 'comp', id: 9, name: '혼자', img: 'img/alone.jpg' },
      { title: 'comp', id: 10, name: '친구', img: 'img/friends.jpg' },
      { title: 'comp', id: 11, name: '연인', img: 'img/couple.jpg' },
      { title: 'comp', id: 12, name: '가족', img: 'img/family.jpg' },
    ],
    [
      { title: 'impo', id: 13, name: '풍경', img: 'img/nature.jpg' },
      { title: 'impo', id: 14, name: '음식', img: 'img/food.jpg' },
      { title: 'impo', id: 15, name: '액티비티', img: 'img/activity.jpg' },
      { title: 'impo', id: 16, name: '힐링', img: 'img/relax.jpg' },
    ],
    [
      {
        title: 'paint',
        id: 17,
        name: '별이 빛나는 밤',
        img: 'img/starrynight.jpg',
      },
      {
        title: 'paint',
        id: 18,
        name: '그랑드자트섬의 일요일 오후',
        img: 'img/grande.jpg',
      },
      {
        title: 'paint',
        id: 19,
        name: '메모리 지속성의 붕괴',
        img: 'img/memory.jpg',
      },
      {
        title: 'paint',
        id: 20,
        name: '민중을 이끄는 자유의 여신',
        img: 'img/liberty.jpg',
      },
    ],
    [
      { title: 'movie', id: 21, name: '기생충', img: 'img/parasite.jpg' },
      { title: 'movie', id: 22, name: '토이스토리', img: 'img/toystory.jpg' },
      {
        title: 'movie',
        id: 23,
        name: '인터스텔라',
        img: 'img/interstellar.jpg',
      },
      { title: 'movie', id: 24, name: '건축학개론', img: 'img/건축학개론.jpg' },
      {
        title: 'movie',
        id: 25,
        name: '분노의 질주',
        img: 'img/분노의질주.jpg',
      },
      { title: 'movie', id: 26, name: '극한직업', img: 'img/극한직업.jpg' },
    ],
    [
      { title: 'trans', id: 27, name: '자가용', img: 'img/car.jpg' },
      { title: 'trans', id: 28, name: '대중교통', img: 'img/bus.jpg' },
      { title: 'trans', id: 29, name: '도보', img: 'img/walking.jpg' },
    ],
    [
      { title: 'plan', id: 30, name: '계획', img: 'img/plan.jpg' },
      { title: 'plan', id: 31, name: '즉흥', img: 'img/생각없음.jpg' },
    ],
    [
      { title: 'more_eve', id: 32, name: '아침형 인간', img: 'img/early.jpg' },
      { title: 'more_eve', id: 33, name: '저녁형 인간', img: 'img/night.jpg' },
    ],
  ];
  const questionList = [
    '가장 좋아하는 계절',
    '산과 바다 중에 더 좋아하는 장소',
    '도시와 시골 중 더 좋은 곳',
    '여행갈 때 같이갈 사람',
    '여행지를 선정할 때 가장 중요한 것',
    '가장 마음에 드는 그림',
    '가장 마음에 드는 영화',
    '여행지에서 사용하는 교통수단',
    '여행을 준비할 때',
    '일상 스타일',
  ];
  const [tourData, setTourData] = useState([]);
  const [pageIndex, setPageIndex] = useState(-2);
  const [tastes, setTastes] = useState([]);
  const [tours, setTours] = useState([]);

  let leftLoc = String(13 + (pageIndex + 1) * 7.7) + 'vw';
  // survey-bar 의 left 값이 15vw 로 되어 있다
  // 10개의 취향 설문 + 1개의 지역 설문이 진행되니까
  // 11번째 페이지에서 진행도가 맨 끝으로 가 있어야 한다

  function nextPage() {
    if (pageIndex <= 8) {
      setPageIndex(pageIndex + 1);
    } else {
      AddTaste(tastes)
        .then(() => {
          console.log('취향 데이터 연결 후 응답 완료');
        })
        .catch((error) => {
          console.log('취향 데이터 연결 실패', error);
        });
    }
  }

  function beforePage() {
    if (pageIndex >= 1) {
      setPageIndex(pageIndex - 1);
    }
  }

  function startPage() {
    setPageIndex(-1);
  }

  function lastPage() {
    setPageIndex(tastes.length - 1);
  }

  function tasteSurveys(pageIndex, imageTitle, imageId, imageName) {
    // 취향 질문의 답변을 배열 형태로 저장하는 함수
    const newTaste = {
      title: imageTitle,
      id: imageId,
      name: imageName,
    };
    if (pageIndex < tastes.length) {
      // 한 번 진행한 취향을 바꾸는 경우
      const tempTastes = [...tastes];
      tempTastes[pageIndex] = newTaste;
      setTastes(tempTastes);
    } else {
      // 새로운 취향 설문을 진행한 경우
      setTastes(tastes.concat(newTaste));
    }
  }

  useEffect(() => {
    const source = axios.CancelToken.source();
    AllCitiesList()
      .then((response) => {
        console.log('여행지 전체 목록 가져오기 성공', response.data);
        setTourData(response.data);
      })
      .catch((error) => {
        console.log('여행지 전체 목록 가져오기 실패', error);
      });
    setPageIndex(-2);
    setTastes([]);
    setTours([]);
    return function () {
      source.cancel();
    };
  }, []);

  return (
    <div className="Survey">
      {pageIndex >= -1 && (
        <>
          <div className="Survey-bar" />
          <img
            className="Survey-progress"
            style={{ position: 'absolute', left: leftLoc }}
            alt="오디가지"
            src={process.env.PUBLIC_URL + 'img/오디가지.png'}
          />
          <div
            className="Survey-progress-bg"
            style={{ width: `${String((pageIndex + 1) * 7.7)}vw` }}
          ></div>
        </>
      )}
      {pageIndex === -2 && <Intro nextPage={nextPage} tourData={tourData} />}
      {pageIndex === -1 && (
        <TourList
          pageIndex={pageIndex}
          tourData={tourData}
          tours={tours}
          beforePage={beforePage}
          nextPage={nextPage}
          startPage={startPage}
          lastPage={lastPage}
          setTours={setTours}
        />
      )}
      {pageIndex >= 0 && (
        <Question
          surveyData={surveyData}
          questionList={questionList}
          pageIndex={pageIndex}
          tastes={tastes}
          nextPage={nextPage}
          beforePage={beforePage}
          startPage={startPage}
          lastPage={lastPage}
          tasteSurveys={tasteSurveys}
        />
      )}
    </div>
  );
}

export default Survey;
