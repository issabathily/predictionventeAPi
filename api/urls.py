from django.urls import path
from .views import welcome, home, predict

urlpatterns = [
    path("", welcome, name="welcome"),
    path("chatbot/", home, name="home"),
    path("predict/", predict, name="predict"),
]