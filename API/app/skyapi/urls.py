from django.urls import path
from .views import SkyStateView

urlpatterns = [
    path('state/', SkyStateView.as_view()),
]