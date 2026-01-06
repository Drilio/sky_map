from django.urls import path
from .views import Cities
from .views import SkyView

urlpatterns = [
    path('cities/', Cities.as_view()),
    path('<str:latitude>:<str:longitude>/<str:datetime>/<str:stars_filter>:<int:limit>', SkyView.as_view()),
]
