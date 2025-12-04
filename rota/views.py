from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
import json
from .models import Predio, RegistroRota

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


@require_POST
@login_required
def registrar_rota(request):
    """
    Recebe JSON: {"nome": "...", "latitude": -22.97, "longitude": -43.23}
    Cria (ou reaproveita) um Predio em rota.Predio e registra a rota.
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
        nome = data.get("nome")
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if not nome or latitude is None or longitude is None:
            return JsonResponse(
                {"error": "nome, latitude e longitude são obrigatórios"},
                status=400,
            )

        # cria ou reaproveita um prédio local na app rota
        predio, created = Predio.objects.get_or_create(
            nome=nome,
            defaults={"latitude": latitude, "longitude": longitude},
        )

        # se já existia mas sem coordenadas, podemos atualizar
        if not created and (predio.latitude is None or predio.longitude is None):
            predio.latitude = latitude
            predio.longitude = longitude
            predio.save(update_fields=["latitude", "longitude"])

        RegistroRota.objects.create(
            user=request.user,
            predio=predio,
            tipo="route",
        )

        return JsonResponse({"ok": True})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@login_required
def registro_rotas(request):
    registros = (
        RegistroRota.objects
        .filter(user=request.user)
        .select_related("predio")
    )
    return render(request, "registro_rotas.html", {"registros": registros})