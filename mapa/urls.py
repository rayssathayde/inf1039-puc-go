from django.urls import path
from . import views

app_name = 'mapa'

urlpatterns = [
    path('locais/', views.listar_locais, name='listar_locais'),
    path('predios/', views.listar_predios, name='listar_predios'),
    path('mapas/', views.mapas, name='mapa'),
    path('favoritar_local/<int:local_id>/', views.favoritar_local, name='favoritar_local'),
    path('favoritar_predio/<int:predio_id>/', views.favoritar_predio, name='favoritar_predio'),
]