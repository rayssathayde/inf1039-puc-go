from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Q

from mapa.models import Predio, Local, FavoritoLocal, FavoritoPredio

# Create your views here.
def home(request):
    predios = Predio.objects.all()
    tipos = Local.TIPO_CHOICES
    return render(request, 'index.html', {
        'predios': predios,
        'tipos': tipos
    })

def search_result(request):
    query = request.GET.get('result_pesquisa', '')
    categoria = request.GET.get('categorias', 'all')
    predio_id = request.GET.get('predios', 'all_predios')
    cadeirante = request.GET.get('cadeirante', '') == 'on'
    elevador = request.GET.get('elevador', '') == 'on'
    
    locais = Local.objects.filter(ativo=True).select_related('predio')
    
    if query:
        locais = locais.filter(
            Q(nome__icontains=query) |
            Q(descricao__icontains=query) |
            Q(predio__nome__icontains=query)
        )
    
    if categoria and categoria != 'all':
        locais = locais.filter(tipo=categoria)
    
    if predio_id and predio_id != 'all_predios':
        locais = locais.filter(predio_id=predio_id)
    
    if cadeirante:
        locais = locais.filter(informacoes_extras__acessivel_cadeirante=True)
    
    if elevador:
        locais = locais.filter(informacoes_extras__proximo_elevador=True)

    favoritos_locais_ids = []
    favoritos_predios_ids = []

    if request.user.is_authenticated:
        favoritos_locais_ids = list(
            FavoritoLocal.objects.filter(user=request.user)
            .values_list('local_id', flat=True)
        )

        favoritos_predios_ids = list(
            FavoritoPredio.objects.filter(user=request.user)
            .values_list('predio_id', flat=True)
        )
    
    contexto = {
        'locais': locais,
        'query': query,
        'total_resultados': locais.count(),
        'predios': Predio.objects.all(),
        'tipos': Local.TIPO_CHOICES,
        'selected_categoria': categoria,
        'selected_predio': predio_id,
        'cadeirante_checked': cadeirante,
        'elevador_checked': elevador,
        'favoritos_locais_ids': favoritos_locais_ids,
        'favoritos_predios_ids': favoritos_predios_ids,
    }
    
    return render(request, 'resultado_pesquisa.html', contexto)

def available_locations(request):
    return render(request, 'locais_disponiveis.html')

def info_ambientes(request):
    return render(request, 'info_ambientes.html')


