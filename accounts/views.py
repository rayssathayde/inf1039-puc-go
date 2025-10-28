from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login

# Create your views here.
def login(request):
    if request.method == "GET":
        return render(request, 'login.html')
    else:
        email = request.POST.get('email')
        senha = request.POST.get('password')

        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(request, username=user_obj.username, password=senha)
        except User.DoesNotExist:
            user = None 

        if user:
            auth_login(request, user)
            messages.success(request, f"Bem-vindo, {user.username}!")

            next_page = request.GET.get('next', 'home')
            return redirect(next_page)
        else: 
            messages.error(request, "Email ou senha incorretos")
            return redirect('login')
    
    

def register(request): 
    if request.method == "GET":
        return render(request, 'cadastro.html')
    else:
        username = request.POST.get('username')
        email = request.POST.get('email')
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
            messages.error(request, "Já existe um usuário com esse nome.")
            return redirect('register')
    

        user = User.objects.create_user(username=username, email=email, password=senha)

        user.save()

        messages.success(request, f"Usuário {username} cadastrado com sucesso!")
        return redirect('login')
    
#@login_required(login_url='login')
def favorites(request):
    return render(request, 'localizacoes_favoritas.html')
        
        