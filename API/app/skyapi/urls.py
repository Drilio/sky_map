from django.urls import path
from .views import TopBrightestParis

urlpatterns = [

    path('topid/', TopBrightestParis.as_view()),
]
