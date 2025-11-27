from django.http import JsonResponse
from .models import Predio

def listar_predios(request):
    predios = Predio.objects.all()

    #corrigido lat e long. estavam como coordenadas[]
    dados = [
        {
            "id": p.id,
            "nome": p.nome,
            "latitude": p.latitude,
            "longitude": p.longitude
        }
        for p in predios
    ]

    return JsonResponse(dados, safe=False)