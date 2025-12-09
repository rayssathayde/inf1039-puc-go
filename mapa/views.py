from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse


from .models import Local, Predio, FavoritoLocal, FavoritoPredio

def mapas(request):
    return render(request, 'mapa.html')


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




@login_required(login_url='login')
def favoritar_local(request, local_id):
    local = get_object_or_404(Local, id=local_id)

    favorito, created = FavoritoLocal.objects.get_or_create(
        user=request.user,
        local=local
    )

    if not created:
        favorito.delete()  # se já existia, remove 

    return redirect(request.META.get('HTTP_REFERER', 'home')) # volta pra página anterior


@login_required(login_url='login')
def favoritar_predio(request, predio_id):
    predio = get_object_or_404(Predio, id=predio_id)

    favorito, created = FavoritoPredio.objects.get_or_create(
        user=request.user,
        predio=predio
    )

    if not created:
        favorito.delete()  

    return redirect(request.META.get('HTTP_REFERER', 'home'))


def login_required_message(request):
    messages.error(request, "Você precisa estar logado para favoritar locais.")
    referer = request.META.get('HTTP_REFERER')
    if referer:
        return redirect(referer)
    login_url = reverse('login')   # espera que exista name='login'
    next_path = request.get_full_path() or '/'
    return redirect(f"{login_url}?next={next_path}")

