from django.urls import path
from . import views

urlpatterns = [
    path("api/predios/", views.listar_predios),
]