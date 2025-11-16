from django.contrib import admin
from .models import Predio, Local, FavoritoPredio, FavoritoLocal

@admin.register(Predio)
class PredioAdmin(admin.ModelAdmin):
    list_display = ['nome', 'descricao']
    search_fields = ['nome']

@admin.register(Local)
class LocalAdmin(admin.ModelAdmin):
    list_display = ['nome', 'tipo', 'predio', 'andar', 'ativo']
    list_filter = ['tipo', 'predio', 'ativo']
    search_fields = ['nome', 'descricao']
    list_editable = ['ativo']


@admin.register(FavoritoPredio)
class FavoritoPredioAdmin(admin.ModelAdmin):
    list_display = ['user', 'predio', 'criado_em']
    list_filter = ['predio', 'user']
    search_fields = ['user__username', 'predio__nome']


@admin.register(FavoritoLocal)
class FavoritoLocalAdmin(admin.ModelAdmin):
    list_display = ['user', 'local', 'criado_em']
    list_filter = ['local', 'user']
    search_fields = ['user__username', 'local__nome']