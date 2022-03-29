from django.shortcuts import get_list_or_404, get_object_or_404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

import numpy as np
from scipy.sparse import csr_matrix

from .models import Taste
from .serializers import Taste_serializer
from accounts.models import User
from cities.models import City, Visit
from cities.serializers import Visit_serializer, City_visited_serializer, City_serializer

from .recommend import knn_recommend, popular_cities, random_city

# Create your views here.
@swagger_auto_schema(
    methods=['GET'],
    responses={200: openapi.Response('', Visit_serializer(many=True)),
               404: openapi.Response('')
               })
@swagger_auto_schema(
    methods=['POST'],
    request_body=Visit_serializer,
    responses={201: openapi.Response(''),
               400: openapi.Response(''),
               404: openapi.Response('')
               })
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def sel_city(self, request):
    '''
    GET : 본인이 다녀온 지역 확인
    POST : 새로운 지역에 대한 평점 추가
    '''
    user = request.user
    if request.method == "GET":
        visits = get_list_or_404(Visit, user_id = user.id)
        serializer = Visit_serializer(visits, many=True)
        return Response(data=serializer.data)

    elif request.method == "POST":
        city_id = request.data.get("city")

        if not user.rate_cities.filter(pk=city_id).exists():
            serializer = Visit_serializer(data=request.data)
        else:
            visit = get_object_or_404(Visit, user_id=user.id, city_id=city_id)
            if not request.data.get('rate'):
                visit.delete()
                return Response(status=status.HTTP_205_RESET_CONTENT)
            serializer = Visit_serializer(instance=visit, data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    methods=['GET'],
    responses={200: openapi.Response('', Taste_serializer(many=True))})
@api_view(["GET"])
@permission_classes([AllowAny])
def taste(request):
    '''
    GET : 본인의 취향 확인
    '''
    user = request.user
    taste = get_object_or_404(Taste, user_id=user.id)
    serializer = Taste_serializer(taste)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def by_big_data(request):
    user_id = request.user.id
    result = knn_recommend(user_id)
    print(result)
    pass

@swagger_auto_schema(
    methods=['GET'],
    responses={200: openapi.Response('', City_visited_serializer(many=True))})
@api_view(["GET"])
@permission_classes([AllowAny])
def popular(request, n):
    rank = popular_cities(n)
    populars = []
    for r in rank:
        city_id = r[0]
        city = get_object_or_404(City, id=city_id)
        ser = City_visited_serializer(city)
        populars.append(ser.data)
    return Response(populars, status=status.HTTP_200_OK)

@swagger_auto_schema(
    methods=['GET'],
    responses={200: openapi.Response('', City_serializer)})
@api_view(["GET"])
@permission_classes([AllowAny])
def by_random(request):
    city = random_city()
    serializer = City_serializer(city)
    return Response(serializer.data, status=status.HTTP_200_OK)



















