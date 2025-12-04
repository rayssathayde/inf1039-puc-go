
from django.urls import path
from . import views

urlpatterns = [
    path("api/predios/", views.listar_predios),

    # Endpoint para registrar as rotas do usuário
    path(
        "registros/registrar-rota/",
        views.registrar_rota,
        name="registrar_rota",
    ),

    # Histórico de rotas do usuário logado
    path(
        "registros/",
        views.registro_rotas,
        name="registro_rotas",
    ),
]