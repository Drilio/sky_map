from django.urls import path
from .views import Date, Top, TopId

urlpatterns = [
    path('date/', Date.as_view()),
    path('top/', Top.as_view()), 
    path('topid/', TopId.as_view()), 
]