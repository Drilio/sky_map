from django.urls import path
from .views import Date, TopBrightness

urlpatterns = [
    path('date/', Date.as_view()),
    path('topbrightness/', TopBrightness.as_view())
]