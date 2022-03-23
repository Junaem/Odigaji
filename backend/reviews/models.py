from django.conf import settings
from django.db import models
from cities.models import Cities, Province


class CityReview(models.Model):
    '''
    관광지 리뷰 테이블
    '''
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='user_reviews',on_delete=models.CASCADE)
    city = models.ForeignKey(Cities, related_name='city_reviews',on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    content = models.TextField()
    created = models.DateField(auto_now_add=True)
    updated = models.DateField(auto_now=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    '''
    관광지 리뷰 댓글 테이블
    '''
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='user_commnets', on_delete=models.CASCADE)
    city = models.ForeignKey(Cities, related_name='city_commnets', on_delete=models.CASCADE)
    province = models.ForeignKey(Province, on_delete=models.CASCADE)
    content = models.TextField()
    created = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.content