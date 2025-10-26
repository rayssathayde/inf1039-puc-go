from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.
def home(request):
    return render(request, 'index.html')

@login_required(login_url='login')
def favorites(request):
    return render(request, 'localizacoes_favoritas.html')

def search_result(request):
    return render(request, 'resultado_pesquisa.html')

def available_locations(request):
    return render(request, 'locais_disponiveis.html')

