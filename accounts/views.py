from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.decorators import login_required
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth import logout

from mapa.models import FavoritoPredio, FavoritoLocal

# Create your views here.
def login(request):
    if request.method == "GET":
        return render(request, 'login.html')
    else:
        email = request.POST.get('email', '').strip().lower()
        senha = request.POST.get('password')


        user_obj = User.objects.filter(email=email).first()
        if user_obj:
            user = authenticate(request, username=user_obj.username, password=senha)
        else:
            user = None 

        if not email or not senha:
            messages.error(request, "Preencha todos os campos")
            return redirect('login')
        
        if user:
            auth_login(request, user)
            messages.success(request, f"Bem-vindo(a), {user.username}!")

            next_page = request.GET.get('next', 'home')
            return redirect(next_page)
        else: 
            messages.error(request, "Email ou senha incorretos")
            return redirect('login')
    
    

def register(request): 
    if request.method == "GET":
        return render(request, 'cadastro.html')
    else:
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip().lower()
        senha = request.POST.get('password')
        confirm = request.POST.get('confirm-password')
        terms = request.POST.get('terms')

        if not username or not email or not senha:
            messages.error(request, "Preencha todos os campos")
            return redirect('register')
    
        if senha != confirm:
            messages.error(request, "As senhas não conferem")
            return redirect('register')

        if not terms:
            messages.error(request, "Para se cadastrar você deve aceitar os termos")
            return redirect('register')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Já existe um usuário com esse nome")
            return redirect('register')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, "Esse email já está cadastrado")
            return redirect('register')
        
        try:
            validate_email(email)
        except ValidationError:
            messages.error(request, "Digite um email válido 'nome@dominio.com'")
            return redirect('register')

        if len(senha) < 8:
            messages.error(request, "A senha deve ter pelo menos 8 caracteres")
            return redirect('register')   

        user = User.objects.create_user(username=username, email=email, password=senha)

        user.save()

        messages.success(request, f"{username}, sua conta foi criada com sucesso! Faça login para continuar")
        return redirect('login')
    
@login_required(login_url='login')
def favorites(request):
    favoritos_predios = FavoritoPredio.objects.filter(
        user=request.user
    ).select_related('predio')

    favoritos_locais = FavoritoLocal.objects.filter(
        user=request.user
    ).select_related('local', 'local__predio')

    context = {
        'favoritos_predios': favoritos_predios,
        'favoritos_locais': favoritos_locais,
    }
    return render(request, 'localizacoes_favoritas.html', context)
        

def user_logout(request):
    logout(request)
    messages.success(request, "Você saiu da sua conta.")
    return redirect('home')





