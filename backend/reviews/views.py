from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import (
    Review_list_serializer,
    Review_serializer,
    Comment_list_serializer,
)
from accounts.serializers import User_mypage_serializer
from .models import CityReview, Comment
from accounts.models import User
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
    )
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.core.paginator import Paginator



@swagger_auto_schema(
    methods=['GET'],
    responses={200: openapi.Response('', Review_list_serializer(many=True)),
               404: openapi.Response('')
    })
@api_view(['GET'])
@permission_classes([AllowAny])
def all_reviews(request):
    '''
    전체 리뷰를 반환하는 함수
    '''
    if request.method=='GET':
        reviews = CityReview.objects.all()
        paginator = Paginator(reviews, 10)
        page_number = request.GET.get('page_num')
        reviews = paginator.get_page(page_number)
        serializer = Review_list_serializer(reviews, many=True)
        data = serializer.data
        # for i in range(len(data)):
        #     # print(serializer.data[i]['user'])
        #     user = User.objects.filter(id=serializer.data[i]['user'])
        #     userserializer = User_mypage_serializer(user, many=True)
        #     # print(userserializer.data[0]['id'])
        #     # print(userserializer.data[0]['username'])
        #     # print(userserializer.data[0]['nickname'])
        #     data[i].update({'username': userserializer.data[0]['username']})
        #     data[i].update({'nickname': userserializer.data[0]['nickname']})
        #     data[i].update({'photo': userserializer.data[0]['photo']})
        #     # print(data)
        data.append({'total_pages': paginator.num_pages})
        return Response(data, status=HTTP_200_OK)
    return Response({'message': '잘못된 접근입니다.'}, status=HTTP_400_BAD_REQUEST)



@swagger_auto_schema(
    methods=['GET'],
    responses={200: openapi.Response('', Review_list_serializer(many=True)),
               404: openapi.Response('')
    })
@swagger_auto_schema(
    methods=['POST'],
        request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'title': openapi.Schema(type=openapi.TYPE_STRING, description='리뷰제목'),
            'content': openapi.Schema(type=openapi.TYPE_STRING, description='리뷰내용'),
        }
    ),
    responses={201: openapi.Response('', Review_list_serializer),
               400: openapi.Response(''),
               404: openapi.Response('')
    })
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
# def city_reviews(request, city_id, page_number):
def city_reviews(request, city_id):
    '''
    GET: 관광지에 달린 리뷰를 반환
    POST: 관광지에 리뷰를 생성
    '''
    if request.method=='GET':
        reviews = CityReview.objects.filter(city=city_id)
        paginator = Paginator(reviews, 10)
        page_number = request.GET.get('page_num')
        reviews = paginator.get_page(page_number)
        serializer = Review_list_serializer(reviews, many=True)
        data = serializer.data
        data.append({'total_pages': paginator.num_pages})
        return Response(data, status=HTTP_200_OK)
    elif request.method=='POST':
        request.data['city'] = city_id
        serializer = Review_serializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(status=HTTP_400_BAD_REQUEST)
        
    return Response({'message': '잘못된 접근입니다.'}, status=HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    methods=['GET'],
    responses={200: openapi.Response('', Review_list_serializer(many=True)),
               404: openapi.Response('')
    })
@api_view(['GET'])
@permission_classes([AllowAny])
def user_reviews(request):
    '''
    유저가 작성한 모든 리뷰를 반환
    '''
    print(request)
    if request.method=='GET':
        reviews = CityReview.objects.filter(user=request.user.pk)
        paginator = Paginator(reviews, 10)
        page_number = request.GET.get('page_num')
        reviews = paginator.get_page(page_number)
        serializer = Review_list_serializer(reviews, many=True)
        data = serializer.data
        data.append({'total_pages': paginator.num_pages})
        return Response(data, status=HTTP_200_OK)
    return Response({'message': '잘못된 접근입니다.'}, status=HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=['GET'],
    responses={200: openapi.Response('', Review_list_serializer),
               404: openapi.Response('')
    })
@swagger_auto_schema(
    methods=['PUT'],
    request_body=Review_serializer,
    responses={200: openapi.Response('', Review_serializer),
               400: openapi.Response(''),
               401: openapi.Response(''),
               404: openapi.Response('')}
    )
@swagger_auto_schema(
    methods=['DELETE'],
    responses={200: openapi.Response(''),
               404: openapi.Response('')
    })
@api_view(['GET','PUT','DELETE'])
@permission_classes([AllowAny])
def review_info(request, review_id):
    '''
    GET: 리뷰 상세정보
    PUT: 리뷰 수정
    DELETE: 리뷰 삭제
    '''
    review = get_object_or_404(CityReview, pk=review_id)
    if request.method=='GET':
        serializer = Review_serializer(review)
        data = serializer.data
        return Response(data, status=HTTP_200_OK)

    elif request.method=='PUT':
        if request.user.is_authenticated and review.user.id == request.user.pk:
            serializer = Review_serializer(review, data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=HTTP_200_OK)
            return Response(status=HTTP_400_BAD_REQUEST)
        return Response(status=HTTP_401_UNAUTHORIZED)

    elif request.method=='DELETE':
        if request.user.is_authenticated and review.user.id == request.user.pk:
            review.delete()
            return Response({'message': '삭제되었습니다.'}, status=HTTP_200_OK)

    return Response({'message': '잘못된 접근입니다.'}, status=HTTP_400_BAD_REQUEST)


# 댓글 -------------------------------------------------------------------------------


@swagger_auto_schema(
    methods=['GET'],
    responses={200: openapi.Response('댓글 조회 성공'),
               400: openapi.Response('댓글 조회 실패')
               })
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def all_comment(request):
    '''
    특정 유저가 작성한 관광지 리뷰 댓글 목록을 반환하는 함수
    '''
    if request.method=='GET':
        comments = Comment.objects.filter(user=request.user.id)
        serializer = Comment_list_serializer(comments, many=True)
        return Response(serializer.data, status=HTTP_200_OK)
    return Response({'message': '잘못된 접근입니다.'}, status=HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=['GET'],
    responses={200: openapi.Response('조회 성공'),
               400: openapi.Response('조회 실패')
               })
@swagger_auto_schema(
    methods=['POST'],
    request_body=Comment_list_serializer,
    responses={201: openapi.Response('', Comment_list_serializer),
               400: openapi.Response(''),
               404: openapi.Response('')
    })
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def comment_list(request, review_id):
    '''
    특정 관광지 리뷰의 전체 댓글 목록을 반환하는 함수
    '''
    review = get_object_or_404(CityReview, id=review_id)
    
    # 해당 리뷰의 댓글 조회
    print('댓글조회성공')
    print(request.user)
    if request.method == 'GET':
        comments = Comment.objects.filter(review_id=review_id).order_by('-id')
        serializer = Comment_list_serializer(comments, many=True)
        return Response(serializer.data)
    
    # 해당 리뷰의 댓글 작성
    elif request.method == 'POST':
        serializer = Comment_list_serializer(data=request.data)
        
        if serializer.is_valid(raise_exception=True):
            # 프론트에서 axios 요청할 때 URI에 movie의 id값을 넣어서 요청해야 함
            serializer.save(user=request.user, review=review)
            return Response(serializer.data, status=HTTP_201_CREATED)
    elif request.method == 'DELETE':
        if request.user.is_authenticated and comments.user.id == request.user.pk:
            review.delete()
            return Response({'message': '삭제되었습니다.'}, status=HTTP_200_OK)

    else:
        return Response({'error': '입력에 문제가 있습니다.'}, status=HTTP_400_BAD_REQUEST)
    return Response({ 'Unauthorized': '권한이 없습니다.'}, status=HTTP_403_FORBIDDEN)

@swagger_auto_schema(
    methods=['PUT'],
    request_body=Comment_list_serializer,
    responses={200: openapi.Response('조회 성공', Comment_list_serializer),
               400: openapi.Response('조회 실패')
    })
@swagger_auto_schema(
    methods=['DELETE'],
    responses={201: openapi.Response(''),
               400: openapi.Response(''),
               404: openapi.Response('')
    })
@api_view(['PUT', 'DELETE'])
@permission_classes([AllowAny])
def comment_detail(request, comment_id):
    '''
    특정 관광지 리뷰의 특정 댓글을 수정 또는 삭제하는 함수
    '''
    comment = get_object_or_404(Comment, pk=comment_id)
    print(comment.user)
    print(request.user)

    # 현재 유저와 댓글 작성자가 같을 때 수정 및 삭제 가능
    if request.user == comment.user:
        # 수정
        if request.method == 'PUT':
            serializer = Comment_list_serializer(comment, data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=HTTP_200_OK)
        # 삭제
        elif request.method == 'DELETE':
            comment.delete()
            data = {
                'delete' : f'{comment_id}번 댓글이 삭제되었습니다.'
            }
            return Response(data, status=HTTP_200_OK)
        
    return Response({ 'Unauthorized': '권한이 없습니다.'}, status=HTTP_403_FORBIDDEN)