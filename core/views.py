from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db.models import Q, F

from mapa.models import Predio, Local, FavoritoLocal, FavoritoPredio

# Create your views here.
def home(request):
    predios = Predio.objects.all()
    tipos = Local.TIPO_CHOICES
    
    # com 3 locais mais buscados
    locais_populares = Local.objects.filter(
        ativo=True,
        search_count__gt=0
    ).order_by('-search_count')[:3]

    locais_sugeridos = list(locais_populares)

    # se ainda não tiver 3, completa com default
    if len(locais_sugeridos) < 3:
        faltando = 3 - len(locais_sugeridos)

        sugestoes_default = Local.objects.filter(
            ativo=True,
            sugerido_padrao=True
        ).exclude(
            id__in=[l.id for l in locais_sugeridos]
        )[:faltando]

        locais_sugeridos.extend(sugestoes_default)

    # se ainda assim faltar, completa com local ativo aleatorio
    if len(locais_sugeridos) < 3:
        faltando = 3 - len(locais_sugeridos)

        outros_locais = Local.objects.filter(
            ativo=True
        ).exclude(
            id__in=[l.id for l in locais_sugeridos]
        )[:faltando]

        locais_sugeridos.extend(outros_locais)
    
    favoritos_locais_ids = []
    if request.user.is_authenticated:
        favoritos_locais_ids = list(
            FavoritoLocal.objects.filter(user=request.user)
            .values_list('local_id', flat=True)
    )
    
    
    return render(request, 'index.html', {
        'predios': predios,
        'tipos': tipos,
        'locais_sugeridos': locais_sugeridos,
        'favoritos_locais_ids': favoritos_locais_ids,
    })

def search_result(request):
    query = request.GET.get('result_pesquisa', '')
    categoria = request.GET.get('categorias', 'all')
    predio_id = request.GET.get('predios', 'all_predios')
    cadeirante = request.GET.get('cadeirante', '') == 'on'
    elevador = request.GET.get('elevador', '') == 'on'
    
    locais = Local.objects.filter(ativo=True).select_related('predio')
    predios_encontrados = Predio.objects.none()

    
    if query:
        predios_encontrados = Predio.objects.filter(Q(nome__icontains=query) | 
                                                    Q(descricao__icontains=query))
        locais = locais.filter(
            Q(nome__icontains=query) |
            Q(descricao__icontains=query)).exclude(predio__nome__icontains=query)
        
    
    if categoria and categoria != 'all':
        locais = locais.filter(tipo=categoria)
    
    if predio_id and predio_id != 'all_predios':
        locais = locais.filter(predio_id=predio_id)
        predios_encontrados = predios_encontrados.filter(id=predio_id)
    
    if cadeirante:
        locais = locais.filter(informacoes_extras__acessivel_cadeirante=True)
    
    if elevador:
        locais = locais.filter(informacoes_extras__proximo_elevador=True)
    
    if query:
        Local.objects.filter(
            id__in=locais.values_list('id', flat=True)
        ).update(search_count=F('search_count') + 1)
        
    total_resultados = len(predios_encontrados) + len(locais)
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
        'predios_encontrados': predios_encontrados,
        'query': query,
        'total_resultados': total_resultados,
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
    tipo = request.GET.get('tipo', 'todos')

    locais = Local.objects.filter(ativo=True).select_related('predio')
    if tipo not in ('todos', 'predio'):
        locais = locais.filter(tipo=tipo)

    predios = Predio.objects.all()

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
        'predios': predios,
        'favoritos_locais_ids': favoritos_locais_ids,
        'favoritos_predios_ids': favoritos_predios_ids,
        'tipos': Local.TIPO_CHOICES,
        'selected_tipo': tipo,
    }

    return render(request, 'locais_disponiveis.html', contexto)


def info_ambientes(request, local_id):
    local = get_object_or_404(Local.objects.select_related('predio'), id=local_id)

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
        'local': local,
        'favoritos_locais_ids': favoritos_locais_ids,
        'favoritos_predios_ids': favoritos_predios_ids,
    }

    return render(request, 'info_ambientes.html', contexto)


