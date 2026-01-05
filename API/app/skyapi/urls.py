from django.urls import path
from .views import TopBrightestParis
from .views import Cities

urlpatterns = [
    path('topid/', TopBrightestParis.as_view()),
    path('cities/', Cities.as_view()),
]
