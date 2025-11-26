from django.http import JsonResponse
from .models import Predio

def listar_predios(request):
    predios = Predio.objects.all()

    dados = [
        {
            "id": p.id,
            "nome": p.nome,
            "latitude": p.coordenadas[0],
            "longitude": p.coordenadas[1]
        }
        for p in predios
    ]

    return JsonResponse(dados, safe=False)