from django.urls import path
from . import views

app_name = 'mapa'

urlpatterns = [
    path('locais/', views.listar_locais, name='listar_locais'),
    path('predios/', views.listar_predios, name='listar_predios'),
]