from django.shortcuts import render
from django.http import JsonResponse
from .models import Local, Predio

def listar_locais(request):
    tipo = request.GET.get('tipo', None)
    
    locais = Local.objects.filter(ativo=True).select_related('predio')
    
    if tipo and tipo != 'todos':
        locais = locais.filter(tipo=tipo)
    
    dados = []
    for local in locais:
        dados.append({
            'id': local.id,
            'nome': local.nome,
            'tipo': local.tipo,
            'descricao': local.descricao,
            'predio': local.predio.nome,
            'andar': local.andar,
            'localizacao': local.localizacao_detalhada,
            'coordenadas': local.coordenadas,
            'extras': local.informacoes_extras
        })
    
    return JsonResponse(dados, safe=False)

def listar_predios(request):
    predios = Predio.objects.all()
    
    dados = []
    for predio in predios:
        dados.append({
            'id': predio.id,
            'nome': predio.nome,
            'descricao': predio.descricao,
            'coordenadas': predio.coordenadas,
            'total_locais': predio.locais.filter(ativo=True).count()
        })
    
    return JsonResponse(dados, safe=False)